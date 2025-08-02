# Cyber Hygiene Score App

A full-stack web application to help users understand and improve their cybersecurity practices. It evaluates password strength and simulates browser behavior to produce a "Cyber Hygiene Score".

---

## Features

### Authentication
- User registration & login using session-based auth
- Passwords securely hashed

### Password Evaluation
- Checks for:
  - Length
  - Symbol usage
  - Upper/lowercase diversity

### Score History
- Logged-in users can view historical password evaluations

### Simulated Browser Behavior
- Password reuse
- HTTPS usage
- Flagged domain visits
- Symbol usage report
- Risk percentage estimation

---

## Tech Stack

**Frontend:** React  
**Backend:** Flask + SQLite  
**Styling:** Inline (basic, no frameworks)  
**Security:** Session cookies, password hashing

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/cyber_hygiene_score.git
cd cyber_hygiene_score
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

---

## API Endpoints

| Endpoint     | Method | Description             |
|--------------|--------|-------------------------|
| `/register`  | POST   | Create new user         |
| `/login`     | POST   | Login existing user     |
| `/evaluate`  | POST   | Evaluate password score |
| `/history`   | GET    | View password history   |

---

## Future Improvements

- Docker containerization
- Real browser behavior integration (via browser extension)
- Unit & integration tests
- OAuth login options

---

## Author

Kelvin Odamtten

---

## License

MIT License
