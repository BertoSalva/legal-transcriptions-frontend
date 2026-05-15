import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, CheckCircle2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:50372";
const TOKEN_STORAGE_KEY = "khanyisa_access_token";
const ADMIN_ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

const TRANSCRIPTION_STATUS_LABELS = {
  1: "New",
  2: "Awaiting Payment",
  3: "Paid",
  4: "Processing",
  5: "Completed",
  6: "Failed",
};

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

function getStatusLabel(status) {
  return TRANSCRIPTION_STATUS_LABELS[status] || `Unknown (${status ?? "n/a"})`;
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [adminFilterStatus, setAdminFilterStatus] = useState("all");
  const [adminFilterUserId, setAdminFilterUserId] = useState("");
  const [adminActionStatus, setAdminActionStatus] = useState("idle");
  const [adminActionMessage, setAdminActionMessage] = useState("");

  const decodedToken = useMemo(() => decodeJwtPayload(authToken), [authToken]);

  const isAdmin = useMemo(() => {
    const roleValue = decodedToken?.[ADMIN_ROLE_CLAIM] || decodedToken?.role;
    if (Array.isArray(roleValue)) {
      return roleValue.includes("Admin");
    }
    return roleValue === "Admin";
  }, [decodedToken]);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = decodeJwtPayload(token);
    if (!decoded) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      navigate("/login");
      return;
    }

    const roleValue = decoded?.[ADMIN_ROLE_CLAIM] || decoded?.role;
    const adminRole = Array.isArray(roleValue) ? roleValue.includes("Admin") : roleValue === "Admin";

    if (!adminRole) {
      navigate("/dashboard");
      return;
    }

    setAuthToken(token);
    setCurrentUser({
      userId: decoded?.sub || "",
      fullName: decoded?.name || "",
      email: decoded?.email || "",
    });
  }, [navigate]);

  const fetchAdminTranscriptions = async () => {
    if (!isAdmin) {
      setAdminActionStatus("error");
      setAdminActionMessage("Admin role is required for admin transcription endpoints.");
      return;
    }

    setAdminActionStatus("loading");
    setAdminActionMessage("Loading admin transcription jobs...");

    try {
      const userId = adminFilterUserId.trim();
      const endpoint = userId
        ? `/api/admin/transcriptions/by-user/${userId}`
        : adminFilterStatus === "all"
          ? "/api/admin/transcriptions"
          : `/api/admin/transcriptions/by-status/${adminFilterStatus}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        throw new Error(errorMessage);
      }

      const adminJobs = await response.json();
      setTranscripts(Array.isArray(adminJobs) ? adminJobs : []);
      setAdminActionStatus("success");
      setAdminActionMessage(`Retrieved ${Array.isArray(adminJobs) ? adminJobs.length : 0} admin job(s).`);
    } catch (error) {
      setAdminActionStatus("error");
      setAdminActionMessage(error instanceof Error ? error.message : "Could not load admin jobs.");
    }
  };

  const markPaid = async (jobId) => {
    if (!isAdmin) {
      setAdminActionStatus("error");
      setAdminActionMessage("Admin role is required for mark-paid.");
      return;
    }

    setAdminActionStatus("loading");
    setAdminActionMessage(`Marking job ${jobId} as paid...`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/transcriptions/${jobId}/mark-paid`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        throw new Error(errorMessage);
      }

      setAdminActionStatus("success");
      setAdminActionMessage(`Job ${jobId} marked as paid.`);
      await fetchAdminTranscriptions();
    } catch (error) {
      setAdminActionStatus("error");
      setAdminActionMessage(error instanceof Error ? error.message : "Could not mark job as paid.");
    }
  };

  const runAdminTranscription = async (jobId) => {
    if (!isAdmin) {
      setAdminActionStatus("error");
      setAdminActionMessage("Admin role is required for transcribe.");
      return;
    }

    setAdminActionStatus("loading");
    setAdminActionMessage(`Submitting job ${jobId} for transcription...`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/transcriptions/${jobId}/transcribe`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        throw new Error(errorMessage);
      }

      setAdminActionStatus("success");
      setAdminActionMessage(`Job ${jobId} transcription completed or queued.`);
      await fetchAdminTranscriptions();
    } catch (error) {
      setAdminActionStatus("error");
      setAdminActionMessage(error instanceof Error ? error.message : "Could not transcribe job.");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    navigate("/");
  };

  if (!currentUser) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-page admin-dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>Admin Dashboard</h1>
          <p>Manage transcription jobs and user submissions</p>
        </div>
        <div className="dashboard-user-section">
          <p className="user-email">{currentUser.email}</p>
          <button
            type="button"
            className="signout-button"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="admin-console">
          <h2>Transcription Jobs</h2>
          <div className="admin-filter-row">
            <select
              value={adminFilterStatus}
              onChange={(event) => setAdminFilterStatus(event.target.value)}
              className="job-id-input"
            >
              <option value="all">All statuses</option>
              {Object.entries(TRANSCRIPTION_STATUS_LABELS).map(([code, label]) => (
                <option key={code} value={code}>
                  {code} - {label}
                </option>
              ))}
            </select>
            <input
              value={adminFilterUserId}
              onChange={(event) => setAdminFilterUserId(event.target.value)}
              placeholder="Filter by userId (optional)"
              className="job-id-input"
            />
          </div>
          <button
            className="secondary-fetch-button"
            type="button"
            onClick={fetchAdminTranscriptions}
          >
            Load Admin Transcriptions
          </button>
          {adminActionMessage && (
            <p className={`upload-message ${adminActionStatus}`}>{adminActionMessage}</p>
          )}

          {transcripts.length > 0 && (
            <div className="transcript-list" aria-label="Admin transcriptions">
              {transcripts.map((item) => (
                <article key={item.id} className="transcript-item">
                  <p><strong>File:</strong> {item.originalFileName}</p>
                  <p><strong>Job ID:</strong> {item.id}</p>
                  <p><strong>User ID:</strong> {item.userId}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status-badge status-${item.status}`}>{getStatusLabel(item.status)}</span>
                  </p>
                  {typeof item.quoteAmount === "number" && (
                    <p><strong>Quote:</strong> {item.quoteCurrency || "ZAR"} {item.quoteAmount}</p>
                  )}
                  <p><strong>Created:</strong> {item.createdAtUtc}</p>
                  {item.completedAtUtc && <p><strong>Completed:</strong> {item.completedAtUtc}</p>}
                  {item.transcriptText && <p><strong>Transcript:</strong> {item.transcriptText}</p>}
                  {item.errorMessage && <p><strong>Error:</strong> {item.errorMessage}</p>}
                  <div className="job-inline-actions">
                    {item.status === 2 && (
                      <button
                        type="button"
                        className="mini-action"
                        onClick={() => markPaid(item.id)}
                      >
                        Mark Paid
                      </button>
                    )}
                    {item.status === 3 && (
                      <button
                        type="button"
                        className="mini-action"
                        onClick={() => runAdminTranscription(item.id)}
                      >
                        Transcribe
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
