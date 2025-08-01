import React, { useState, useEffect } from "react";
import "./styles.css";

function App() {
  const [view, setView] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [score, setScore] = useState(null);
  const [history, setHistory] = useState([]);

  const handleAuth = async (endpoint) => {
    try {
      const res = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      alert(data.message);
      if (endpoint === "login" && res.ok) setView("evaluate");
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  const evaluatePassword = async () => {
    try {
      const res = await fetch("http://localhost:5000/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setScore(data.score);
        fetchHistory(); // refresh history
      } else {
        alert(data.message);
      }
    } catch {
      alert("Evaluation failed.");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/history", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setHistory(data);
    } catch {
      alert("Failed to fetch history");
    }
  };

  useEffect(() => {
    if (view === "evaluate") fetchHistory();
  }, [view]);

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
      <h2>Cyber Hygiene Score App</h2>

      {view === "login" || view === "register" ? (
        <>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={() => handleAuth(view)}>
            {view === "login" ? "Login" : "Register"}
          </button>
          <p>
            {view === "login" ? (
              <span>
                New user?{" "}
                <button onClick={() => setView("register")}>Register</button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button onClick={() => setView("login")}>Login</button>
              </span>
            )}
          </p>

          <h4>Simulated Browser Behaviors</h4>
          <ul>
            <li>Reused passwords on multiple sites: <strong>Yes</strong></li>
            <li>Visited flagged domains last week: <strong>3</strong></li>
            <li>Password contains special symbols: <strong>No</strong></li>
            <li>Using secure (HTTPS) websites only: <strong>Mostly</strong></li>
          </ul>
          <p><strong>Browser Behavior Risk Score:</strong> 62%</p>
</>
      ) : (
        <>
          <input
            type="password"
            placeholder="Enter password to evaluate"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <br />
          <button onClick={evaluatePassword}>Evaluate</button>
          {score !== null && <p>Your score: {score}</p>}
          <h4>Score History</h4>
          <ul>
            {history.map((h, i) => (
              <li key={i}>
                {h.password} → {h.score}
              </li>
            ))}
          </ul>

          <h4>Simulated Browser Behaviors</h4>
          <ul>
            <li>Reused passwords on multiple sites: <strong>Yes</strong></li>
            <li>Visited flagged domains last week: <strong>3</strong></li>
            <li>Password contains special symbols: <strong>No</strong></li>
            <li>Using secure (HTTPS) websites only: <strong>Mostly</strong></li>
          </ul>
          <p><strong>Browser Behavior Risk Score:</strong> 62%</p>
</>
      )}
    </div>
  );
}

export default App;
