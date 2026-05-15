import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:50372";
const TOKEN_STORAGE_KEY = "khanyisa_access_token";

async function parseApiError(response) {
  const responseText = await response.text();
  if (!responseText) {
    return `Request failed with status ${response.status}.`;
  }

  try {
    const payload = JSON.parse(responseText);
    if (typeof payload === "string") {
      return payload;
    }
    return payload?.message || payload?.error || JSON.stringify(payload);
  } catch {
    return responseText;
  }
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const payload = {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
      };

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        throw new Error(errorMessage);
      }

      const authPayload = await response.json();
      const token = authPayload?.token || "";
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      setStatus("success");
      setMessage("Account created! Redirecting to dashboard...");
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Registration failed.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/")}
          aria-label="Back to home"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="auth-card">
          <h1>Create Your Account</h1>
          <p className="auth-subtitle">Join Khanyisa for secure transcription services</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              placeholder="Full Name"
              required
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="Password"
              minLength={6}
              required
            />
            <button
              type="submit"
              className="dark-button auth-submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {message && <p className={`auth-message ${status}`}>{message}</p>}

          <p className="auth-footer">
            Already have an account?{" "}
            <button
              type="button"
              className="link-button"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
