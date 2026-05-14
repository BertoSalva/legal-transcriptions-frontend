import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  FileText,
  Landmark,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  Mic,
  Phone,
  Scale,
  ShieldCheck,
  Target,
  Upload,
  UsersRound,
  X,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:50372";

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
  if (!token) {
    return null;
  }

  const segments = token.split(".");
  if (segments.length < 2) {
    return null;
  }

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

function getPayFastRedirectUrl(payload) {
  if (typeof payload === "string") {
    return payload;
  }

  return payload?.redirectUrl || payload?.url || payload?.paymentUrl || "";
}

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

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About Us", href: "#about-us" },
  { label: "Pricing", href: "#pricing" },
  { label: "Client Portal", href: "#client-portal" },
  { label: "Contact", href: "#contact" },
];

const services = [
  {
    icon: Landmark,
    title: "Court Proceedings",
    text: "Verbatim or intelligent verbatim transcripts for criminal and civil matters.",
  },
  {
    icon: UsersRound,
    title: "Arbitration & CCMA Hearings",
    text: "Accurate transcripts for arbitrations, mediations and CCMA hearings.",
  },
  {
    icon: FileText,
    title: "Disciplinary Hearings",
    text: "Transcription of internal and external disciplinary hearings.",
  },
  {
    icon: Mic,
    title: "Legal Dictation",
    text: "Audio notes and dictations transcribed into well-structured legal documents.",
  },
];

const trustPoints = [
  { icon: ShieldCheck, label: "POPIA Compliant" },
  { icon: Target, label: "98%+ Accuracy" },
  { icon: Clock3, label: "Fast Turnaround" },
  { icon: LockKeyhole, label: "Confidential & Secure" },
];

const benefits = [
  {
    icon: BriefcaseBusiness,
    title: "Legally Informed",
    text: "We understand legal language, procedure and formatting.",
  },
  {
    icon: ClipboardCheck,
    title: "Confidential & Secure",
    text: "Strict confidentiality protocols and POPIA compliant handling.",
  },
  {
    icon: BadgeCheck,
    title: "Fast Turnaround",
    text: "Flexible deadlines including urgent and same-day delivery.",
  },
  {
    icon: Scale,
    title: "Human Accuracy",
    text: "Every transcript is carefully reviewed by experienced transcribers.",
  },
];

const pricing = [
  {
    title: "Standard Transcription",
    price: "From R18",
    suffix: "/ audio minute",
    text: "For clear recordings and standard turnaround times.",
    features: ["Speaker labels", "Clean formatting", "Quality review"],
  },
  {
    title: "Urgent Legal Transcription",
    price: "Custom",
    suffix: "quote",
    text: "For urgent hearings, deadlines and same-day requests.",
    features: ["Priority handling", "Flexible deadlines", "Dedicated support"],
    highlighted: true,
  },
  {
    title: "Court-Ready Formatting",
    price: "Included",
    suffix: "on request",
    text: "Professional legal formatting for review-ready documents.",
    features: ["Court-ready layout", "Legal terminology", "Secure delivery"],
  },
];

function Logo({ dark = true }) {
  return (
    <div className="logo-wrapper">
      <div className="logo-mark">
        <div className="logo-inner-line" />
        <span>K</span>
      </div>
      <div className="logo-text">
        <p className={dark ? "logo-name light" : "logo-name dark"}>Khanyisa</p>
        <p className="logo-tagline">Legal Transcriptions</p>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, dark = false }) {
  return (
    <div className="section-title">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={dark ? "section-heading light" : "section-heading"}>{title}</h2>
      <div className="title-line" />
    </div>
  );
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-container">
        <a href="#home" className="brand-link" aria-label="Khanyisa Legal Transcriptions Home">
          <Logo />
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#quote" className="header-cta">
          Request a Quote
        </a>

        <button className="menu-button" onClick={() => setIsOpen((value) => !value)} aria-label="Open menu">
          {isOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mobile-nav"
        >
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className="mobile-cta" href="#quote" onClick={() => setIsOpen(false)}>
            Request a Quote
          </a>
        </motion.div>
      )}
    </header>
  );
}

function HeroVisual() {
  return (
    <div className="hero-card" aria-label="Legal transcription visual">
      <div className="hero-card-inner">
        <div className="scale-circle" />
        <Scale className="hero-scale" strokeWidth={1.1} />
        <div className="document document-back" />
        <div className="document document-front" />
        <div className="pen-shadow" />
        <div className="pen" />
        <div className="pen-line" />
        <div className="pen-band" />
        <p className="hero-visual-text">
          Legal work deserves <span>legal precision.</span>
        </p>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-bg-one" />
      <div className="hero-bg-two" />

      <div className="hero-container">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="hero-content"
        >
          <p className="eyebrow">South African Legal Transcription Services</p>
          <h1>
            Precision.
            <br />
            Confidentiality.
            <br />
            Reliability.
          </h1>
          <p className="hero-subtitle">Court-ready transcripts you can trust.</p>
          <div className="hero-line" />
          <p className="hero-copy">
            Professional transcription and court recording services for legal professionals, law firms,
            corporates and institutions across South Africa.
          </p>

          <div className="hero-actions">
            <a href="#quote" className="primary-button">
              Request a Quote
            </a>
            <a href="#client-portal" className="secondary-button">
              <Upload size={18} /> Upload Audio
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <HeroVisual />
        </motion.div>
      </div>

      <div className="trust-strip">
        <div className="trust-grid">
          {trustPoints.map(({ icon: Icon, label }) => (
            <div key={label} className="trust-item">
              <Icon size={44} strokeWidth={1.35} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="services-section">
      <div className="container">
        <SectionTitle title="Our Services" />
        <div className="services-grid">
          {services.map(({ icon: Icon, title, text }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="service-card"
            >
              <Icon className="service-icon" strokeWidth={1.35} />
              <h3>{title}</h3>
              <p>{text}</p>
              <a href="#quote">
                Learn More <ArrowRight size={16} />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  return (
    <section id="about-us" className="why-section">
      <div className="container">
        <SectionTitle title="Why Choose Khanyisa?" dark />
        <div className="benefits-grid">
          {benefits.map(({ icon: Icon, title, text }) => (
            <article key={title} className="benefit-card">
              <Icon className="benefit-icon" strokeWidth={1.25} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="pricing-section">
      <div className="container">
        <SectionTitle title="Pricing" eyebrow="Transparent, professional and quote-based" />
        <div className="pricing-grid">
          {pricing.map((item) => (
            <article key={item.title} className={item.highlighted ? "pricing-card highlighted" : "pricing-card"}>
              <h3>{item.title}</h3>
              <p className="price">
                {item.price} <span>{item.suffix}</span>
              </p>
              <p className="pricing-text">{item.text}</p>
              <div className="pricing-features">
                {item.features.map((feature) => (
                  <p key={feature}>
                    <CheckCircle2 size={18} /> {feature}
                  </p>
                ))}
              </div>
              <a href="#quote">Get Quote</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientPortal() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ fullName: "", email: "", password: "", adminCode: "" });
  const [authStatus, setAuthStatus] = useState("idle");
  const [authMessage, setAuthMessage] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadMessage, setUploadMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [adminActionStatus, setAdminActionStatus] = useState("idle");
  const [adminActionMessage, setAdminActionMessage] = useState("");
  const [transcriptsStatus, setTranscriptsStatus] = useState("idle");
  const [transcriptsMessage, setTranscriptsMessage] = useState("");
  const [transcripts, setTranscripts] = useState([]);
  const [adminFilterStatus, setAdminFilterStatus] = useState("all");
  const [adminFilterUserId, setAdminFilterUserId] = useState("");
  const [latestJobId, setLatestJobId] = useState("");

  const [authToken, setAuthToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) || "");
  const [currentUser, setCurrentUser] = useState(null);

  const fileName = useMemo(() => selectedFile?.name || "No file selected", [selectedFile]);
  const decodedToken = useMemo(() => decodeJwtPayload(authToken), [authToken]);
  const isAdmin = useMemo(() => {
    const roleValue = decodedToken?.[ADMIN_ROLE_CLAIM] || decodedToken?.role;

    if (Array.isArray(roleValue)) {
      return roleValue.includes("Admin");
    }

    return roleValue === "Admin";
  }, [decodedToken]);

  const isAuthenticated = !!authToken;

  useEffect(() => {
    if (!decodedToken) {
      return;
    }

    setCurrentUser((existing) => ({
      userId: existing?.userId || decodedToken?.sub || "",
      fullName: existing?.fullName || decodedToken?.name || "",
      email: existing?.email || decodedToken?.email || "",
    }));
  }, [decodedToken]);

  const updateAuthField = (field, value) => {
    setAuthForm((current) => ({ ...current, [field]: value }));
  };

  const saveSession = (authPayload) => {
    const token = authPayload?.token || "";
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setAuthToken(token);
    setCurrentUser({
      userId: authPayload?.userId || "",
      fullName: authPayload?.fullName || authForm.fullName || "",
      email: authPayload?.email || authForm.email,
    });
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAuthToken("");
    setCurrentUser(null);
    setTranscripts([]);
    setTranscriptsMessage("");
    setUploadMessage("Signed out.");
    setPaymentMessage("");
    setAdminActionMessage("");
    setSelectedJobId("");
    setLatestJobId("");
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    setAuthStatus("loading");
    setAuthMessage("");

    try {
      const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";
      const payload = {
        email: authForm.email,
        password: authForm.password,
        ...(authMode === "register"
          ? {
              fullName: authForm.fullName,
              ...(authForm.adminCode.trim() ? { adminCode: authForm.adminCode.trim() } : {}),
            }
          : {}),
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
      saveSession(authPayload);
      setAuthStatus("success");
      setAuthMessage(authMode === "register" ? "Account created and signed in." : "Logged in successfully.");
      setAuthForm({ fullName: "", email: authForm.email, password: "", adminCode: "" });
    } catch (error) {
      setAuthStatus("error");
      setAuthMessage(error instanceof Error ? error.message : "Authentication failed.");
    }
  };

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
      setTranscriptsStatus("success");
      setTranscriptsMessage("");
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

  return (
    <section id="client-portal" className="portal-section">
      <div className="container portal-grid">
        <div className="portal-copy">
          <p className="eyebrow">Client Portal</p>
          <h2>Upload audio securely for a court-ready transcript.</h2>
          <p>Sign in, upload your file, and retrieve all previously processed transcripts from the API.</p>

          <div className="portal-list">
            <p><CheckCircle2 size={18} /> Secure audio capture</p>
            <p><CheckCircle2 size={18} /> Supports MP3, WAV, M4A and MP4</p>
            <p><CheckCircle2 size={18} /> Live JWT-protected API calls</p>
          </div>
        </div>

        <div className="upload-card">
          <div className="portal-api-target">API: {API_BASE_URL}</div>
          <div className="flow-chip-row" aria-label="Transcription flow">
            <span>1. Auth</span>
            <span>2. Upload</span>
            <span>3. PayFast</span>
            <span>4. Admin Transcribe</span>
          </div>

          <div className="auth-mode-toggle" role="group" aria-label="Authentication mode">
            <button
              type="button"
              className={authMode === "login" ? "auth-toggle active" : "auth-toggle"}
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === "register" ? "auth-toggle active" : "auth-toggle"}
              onClick={() => setAuthMode("register")}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={submitAuth}>
            {authMode === "register" && (
              <input
                value={authForm.fullName}
                onChange={(event) => updateAuthField("fullName", event.target.value)}
                placeholder="Full Name"
                required
              />
            )}
            {authMode === "register" && (
              <input
                value={authForm.adminCode}
                onChange={(event) => updateAuthField("adminCode", event.target.value)}
                placeholder="Admin Code (optional)"
              />
            )}
            <input
              type="email"
              value={authForm.email}
              onChange={(event) => updateAuthField("email", event.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={authForm.password}
              onChange={(event) => updateAuthField("password", event.target.value)}
              placeholder="Password"
              minLength={6}
              required
            />
            <button className="dark-button auth-submit" type="submit" disabled={authStatus === "loading"}>
              {authStatus === "loading" ? "Please wait..." : authMode === "register" ? "Create Account" : "Login"}
            </button>
          </form>

          {authMessage && <p className={`upload-message ${authStatus}`}>{authMessage}</p>}
          {isAuthenticated && (
            <div className="session-row">
              <p>{currentUser?.email || "Authenticated"}</p>
              <button type="button" className="session-signout" onClick={clearSession}>Sign Out</button>
            </div>
          )}

          <div className="upload-icon-wrap">
            <Upload size={42} />
          </div>
          <h3>Upload your audio file</h3>
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

          <button className="dark-button" onClick={handleUpload} disabled={uploadStatus === "uploading"}>
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

          <button className="secondary-fetch-button" type="button" onClick={fetchTranscripts}>
            Retrieve My Transcripts
          </button>

          {transcriptsMessage && <p className={`upload-message ${transcriptsStatus}`}>{transcriptsMessage}</p>}

          {isAdmin && (
            <div className="admin-console">
              <p className="job-actions-title">Admin Console</p>
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
              <button className="secondary-fetch-button" type="button" onClick={fetchAdminTranscriptions}>
                Load Admin Transcriptions
              </button>
              {adminActionMessage && <p className={`upload-message ${adminActionStatus}`}>{adminActionMessage}</p>}
            </div>
          )}

          {transcripts.length > 0 && (
            <div className="transcript-list" aria-label="Retrieved transcripts">
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
                    {isAdmin && item.status === 2 && (
                      <button
                        type="button"
                        className="mini-action"
                        onClick={() => markPaid(item.id)}
                      >
                        Mark Paid
                      </button>
                    )}
                    {isAdmin && item.status === 3 && (
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
    </section>
  );
}

function QuoteForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    matterType: "Court Proceedings",
    turnaround: "Standard",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const UpdateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const SubmitQuote = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="quote" className="quote-section">
      <div className="container quote-grid">
        <div className="quote-info">
          <SectionTitle title="Request a Quote" />
          <p>
            Send through your matter type, audio length and required turnaround time. We will respond with
            a professional quote and next steps.
          </p>

          <div className="contact-list">
            <p><Phone /> +27 00 000 0000</p>
            <p><Mail /> info@khanyisatranscriptions.co.za</p>
            <p><MapPin /> South Africa</p>
          </div>
        </div>

        <form className="quote-form" onSubmit={SubmitQuote}>
          <div className="form-grid">
            <input value={form.name} onChange={(e) => UpdateField("name", e.target.value)} placeholder="Full Name" required />
            <input value={form.email} onChange={(e) => UpdateField("email", e.target.value)} placeholder="Email Address" type="email" required />
            <input value={form.phone} onChange={(e) => UpdateField("phone", e.target.value)} placeholder="Phone Number" />
            <div className="select-wrapper">
              <select value={form.matterType} onChange={(e) => UpdateField("matterType", e.target.value)}>
                <option>Court Proceedings</option>
                <option>Arbitration / CCMA</option>
                <option>Disciplinary Hearing</option>
                <option>Legal Dictation</option>
              </select>
              <ChevronDown size={18} />
            </div>
            <div className="select-wrapper full-width">
              <select value={form.turnaround} onChange={(e) => UpdateField("turnaround", e.target.value)}>
                <option>Standard</option>
                <option>Urgent</option>
                <option>Same Day</option>
              </select>
              <ChevronDown size={18} />
            </div>
          </div>
          <textarea value={form.message} onChange={(e) => UpdateField("message", e.target.value)} placeholder="Tell us about your transcription request" required />
          <button type="submit" className="primary-button form-button">Submit Request</button>
          {submitted && <p className="form-success">Quote request captured locally. Connect this form to your API or email service next.</p>}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="container footer-container">
        <Logo />
        <p className="footer-quote"><span>“</span> We don’t just type, we understand the law.</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <WhyChooseUs />
      <Pricing />
      <ClientPortal />
      <QuoteForm />
      <Footer />
    </main>
  );
}
