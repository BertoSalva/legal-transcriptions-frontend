import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, CheckCircle2, LogOut } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:50372";
const TOKEN_STORAGE_KEY = "khanyisa_access_token";

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

function getPayFastRedirectUrl(payload) {
  if (typeof payload === "string") return payload;
  return payload?.redirectUrl || payload?.url || payload?.paymentUrl || "";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadMessage, setUploadMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [transcripts, setTranscripts] = useState([]);
  const [transcriptsStatus, setTranscriptsStatus] = useState("idle");
  const [transcriptsMessage, setTranscriptsMessage] = useState("");
  const [latestJobId, setLatestJobId] = useState("");

  const fileName = useMemo(() => selectedFile?.name || "No file selected", [selectedFile]);
  const decodedToken = useMemo(() => decodeJwtPayload(authToken), [authToken]);

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

    setAuthToken(token);
    setCurrentUser({
      userId: decoded?.sub || "",
      fullName: decoded?.name || "",
      email: decoded?.email || "",
    });
  }, [navigate]);

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select an audio or video file first.");
      return;
    }

    if (!authToken) {
      setUploadMessage("Please login first before uploading.");
      return;
    }

    setUploadStatus("uploading");
    setUploadMessage("Uploading file to transcription API...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_BASE_URL}/api/transcriptions`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await parseApiError(response);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setUploadStatus("success");
      setUploadMessage(
        `Transcription submitted: ${result.originalFileName || selectedFile.name}. Status: ${getStatusLabel(result.status)}`
      );
      setLatestJobId(result?.id || "");
      setSelectedJobId(result?.id || "");
      setSelectedFile(null);
      await fetchTranscripts();
    } catch (error) {
      setUploadStatus("error");
      setUploadMessage(error instanceof Error ? error.message : "Upload failed. Please try again.");
    }
  };

  const fetchTranscripts = async () => {
    if (!authToken) {
      setTranscriptsMessage("Please login first to retrieve transcripts.");
      return;
    }

    setTranscriptsStatus("loading");
    setTranscriptsMessage("Loading transcripts...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/transcriptions`, {
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

      const allTranscripts = await response.json();
      setTranscripts(Array.isArray(allTranscripts) ? allTranscripts : []);
      setTranscriptsStatus("success");
      setTranscriptsMessage(`Retrieved ${Array.isArray(allTranscripts) ? allTranscripts.length : 0} transcript(s).`);
    } catch (error) {
      setTranscriptsStatus("error");
      setTranscriptsMessage(error instanceof Error ? error.message : "Could not load transcripts.");
    }
  };

  const startPayment = async (jobId) => {
    if (!authToken) {
      setPaymentMessage("Please login first.");
      return;
    }

    if (!jobId) {
      setPaymentMessage("Select or provide a job ID first.");
      return;
    }

    setPaymentStatus("loading");
    setPaymentMessage("Starting PayFast checkout...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/payfast/start/${jobId}`, {
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

      const rawPayload = await response.text();
      let payload = rawPayload;

      try {
        payload = rawPayload ? JSON.parse(rawPayload) : "";
      } catch {
        payload = rawPayload;
      }

      const redirectUrl = getPayFastRedirectUrl(payload);

      if (!redirectUrl) {
        setPaymentStatus("success");
        setPaymentMessage("Payment session started, but no redirect URL was returned.");
        return;
      }

      setPaymentStatus("success");
      setPaymentMessage("Redirecting to PayFast sandbox...");
      window.location.assign(redirectUrl);
    } catch (error) {
      setPaymentStatus("error");
      setPaymentMessage(error instanceof Error ? error.message : "Could not start payment.");
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
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>Transcription Dashboard</h1>
          <p>Manage your audio files and transcription requests</p>
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
        <div className="dashboard-grid">
          <div className="upload-card">
            <div className="upload-icon-wrap">
              <Upload size={42} />
            </div>
            <h2>Upload your audio file</h2>
            <p>Upload your recording, pay via PayFast, then admins can process transcription.</p>

            <label className="file-input-label">
              Select File
              <input
                type="file"
                accept="audio/*,video/*"
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              />
            </label>

            <div className="selected-file">{fileName}</div>

            <button
              className="dark-button"
              onClick={handleUpload}
              disabled={uploadStatus === "uploading"}
            >
              {uploadStatus === "uploading" ? "Uploading..." : "Upload Audio"}
            </button>

            {uploadMessage && <p className={`upload-message ${uploadStatus}`}>{uploadMessage}</p>}

            <div className="job-actions-card">
              <p className="job-actions-title">Payment Stage</p>
              <input
                value={selectedJobId}
                onChange={(event) => setSelectedJobId(event.target.value.trim())}
                placeholder="Job ID for payment"
                className="job-id-input"
              />
              <button
                className="secondary-fetch-button"
                type="button"
                onClick={() => startPayment(selectedJobId || latestJobId)}
                disabled={paymentStatus === "loading"}
              >
                {paymentStatus === "loading" ? "Starting Payment..." : "Start PayFast Payment"}
              </button>
              {paymentMessage && <p className={`upload-message ${paymentStatus}`}>{paymentMessage}</p>}
            </div>

            <button
              className="secondary-fetch-button"
              type="button"
              onClick={fetchTranscripts}
            >
              Retrieve My Transcripts
            </button>

            {transcriptsMessage && <p className={`upload-message ${transcriptsStatus}`}>{transcriptsMessage}</p>}
          </div>

          {transcripts.length > 0 && (
            <div className="transcript-list" aria-label="Retrieved transcripts">
              <h2>Your Transcripts</h2>
              {transcripts.map((item) => (
                <article key={item.id} className="transcript-item">
                  <p><strong>File:</strong> {item.originalFileName}</p>
                  <p><strong>Job ID:</strong> {item.id}</p>
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
                        onClick={() => startPayment(item.id)}
                      >
                        PayFast Checkout
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
