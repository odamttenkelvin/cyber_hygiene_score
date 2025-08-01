from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:3000"])
app.secret_key = 'supersecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

class ScoreHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    password = db.Column(db.String(200))
    score = db.Column(db.Integer)

def current_user():
    if "user_id" in session:
        return User.query.get(session["user_id"])
    return None

@app.after_request
def apply_cors_headers(response):
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    return response

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "User already exists"}), 409
    new_user = User(username=username, password_hash=generate_password_hash(password))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Registered successfully"})

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        session["user_id"] = user.id
        return jsonify({"message": "Login successful"})
    return jsonify({"message": "Invalid credentials"}), 401

@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"})

@app.route("/evaluate", methods=["POST"])
def evaluate():
    user = current_user()
    if not user:
        return jsonify({"message": "Unauthorized"}), 403
    data = request.get_json()
    password = data.get("password", "")
    score = 100
    if len(password) < 8:
        score -= 30
    if password.lower() == password or password.upper() == password:
        score -= 20
    if password.isalnum():
        score -= 25
    history = ScoreHistory(user_id=user.id, password=password, score=max(score, 0))
    db.session.add(history)
    db.session.commit()
    return jsonify({"score": max(score, 0)})

@app.route("/history", methods=["GET"])
def history():
    user = current_user()
    if not user:
        return jsonify({"message": "Unauthorized"}), 403
    entries = ScoreHistory.query.filter_by(user_id=user.id).all()
    return jsonify([{"password": e.password, "score": e.score} for e in entries])

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
