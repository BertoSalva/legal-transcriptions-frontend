import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:50372";
const TOKEN_STORAGE_KEY = "khanyisa_access_token";
const ADMIN_ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

function decodeJwtPayload(token) {
  if (!token) return null;
  const segments = token.split(".");
  if (segments.length < 2) return null;
  try {
    const base64 = segments[1].replace(/-/g, "+").replace(/_/g, "/");
    const padding = base64.length % 4 ? "=".repeat(4 - (base64.length % 4)) : "";
    const json = atob(base64 + padding);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

async function parseApiError(response) {
  const responseText = await response.text();
  if (!responseText) {
    return `Request failed with status ${response.status}.`;
  }
  try {
    const payload = JSON.parse(responseText);
    if (typeof payload === "string") return payload;
    return payload?.message || payload?.error || JSON.stringify(payload);
  } catch {
    return responseText;
  }
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      const decodedToken = decodeJwtPayload(token);
      if (decodedToken) {
        const roleValue = decodedToken?.[ADMIN_ROLE_CLAIM] || decodedToken?.role;
        const isAdmin = Array.isArray(roleValue) ? roleValue.includes("Admin") : roleValue === "Admin";
        navigate(isAdmin ? "/admin-dashboard" : "/dashboard");
      }
    }
  }, [navigate]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        throw new Error(errorMessage);
      }

      const authPayload = await response.json();
      const token = authPayload?.token || "";
      localStorage.setItem(TOKEN_STORAGE_KEY, token);

      const decodedToken = decodeJwtPayload(token);
      const roleValue = decodedToken?.[ADMIN_ROLE_CLAIM] || decodedToken?.role;
      const isAdmin = Array.isArray(roleValue) ? roleValue.includes("Admin") : roleValue === "Admin";

      setStatus("success");
      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        navigate(isAdmin ? "/admin-dashboard" : "/dashboard");
      }, 1000);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Login failed.");
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
          <h1>Sign In</h1>
          <p className="auth-subtitle">Access your transcription dashboard</p>

          <form onSubmit={handleSubmit} className="auth-form">
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
              {status === "loading" ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {message && <p className={`auth-message ${status}`}>{message}</p>}

          <p className="auth-footer">
            Don't have an account?{" "}
            <button
              type="button"
              className="link-button"
              onClick={() => navigate("/register")}
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
