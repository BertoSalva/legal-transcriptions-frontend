import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Languages,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Facebook,
  FileText,
  Globe2,
  Instagram,
  Landmark,
  Linkedin,
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
import heroCourtImage from "../../images/gravel.png";

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
  {
    icon: Languages,
    title: "Certified Translation",
    text: "Qualified translation professionals for any South African official language.",
  },
  {
    icon: Globe2,
    title: "Media & Television Services",
    text: "Translation and recording support for media interviews, documentaries and TV productions.",
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
        <p className="logo-tagline">Transcribers</p>
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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "About Us", href: "#about-us" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="site-header">
      <div className="header-container">
        <button
          type="button"
          className="brand-link"
          onClick={() => navigate("/")}
          aria-label="Khanyisa Legal Transcribers Home"
        >
          <Logo />
        </button>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-auth-buttons">
          <button
            type="button"
            className="header-link-button"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className="header-cta"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>

        <button
          className="menu-button"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Open menu"
        >
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
          <button
            className="mobile-cta"
            onClick={() => {
              navigate("/register");
              setIsOpen(false);
            }}
          >
            Register
          </button>
          <button
            className="mobile-link-button"
            onClick={() => {
              navigate("/login");
              setIsOpen(false);
            }}
          >
            Sign In
          </button>
        </motion.div>
      )}
    </header>
  );
}

function HeroVisual() {
  return (
    <div className="hero-card" aria-label="Legal transcription visual">
      <div className="hero-image-wrap">
        <img src={heroCourtImage} alt="Court gavel, legal files and scales" className="hero-image" />
      </div>
    </div>
  );
}

function Hero() {
  const navigate = useNavigate();

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
          <p className="eyebrow hero-eyebrow">South African Legal Recording, Translation & Transcription</p>
          <h1>
            Precision.
            <br />
            Confidentiality.
            <br />
            Reliability.
          </h1>
          <p className="hero-subtitle">Court-ready legal records you can trust.</p>
          <div className="hero-line" />
          <p className="hero-copy">
            Precision legal recording, certified translation and transcription services for legal
            professionals, corporations and institutions across South Africa.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" })}
            >
              Request a Quote
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/register")}
            >
              <Upload size={18} /> Upload Audio
            </button>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual-column"
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
  const sliderRef = useRef(null);
  const loopTimeoutRef = useRef(null);

  const getSlideDistance = () => {
    const slider = sliderRef.current;
    if (!slider) return 320;

    const firstCard = slider.querySelector(".service-card");
    const gap = 24;
    return firstCard ? firstCard.clientWidth + gap : 320;
  };

  const normalizeLoopPosition = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slideDistance = getSlideDistance();
    const oneSetWidth = slideDistance * services.length;

    if (slider.scrollLeft >= oneSetWidth) {
      slider.scrollLeft -= oneSetWidth;
    }
  };

  const slideServicesForward = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slideDistance = getSlideDistance();
    slider.scrollBy({ left: slideDistance, behavior: "smooth" });

    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
    }

    loopTimeoutRef.current = setTimeout(() => {
      normalizeLoopPosition();
    }, 450);
  };

  useEffect(() => {
    const intervalId = setInterval(slideServicesForward, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => () => {
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
    }
  }, []);

  return (
    <section id="services" className="services-section">
      <div className="container">
        <SectionTitle title="Our Services" />
        <div
          className="services-slider-shell"
        >
          <div className="services-grid" ref={sliderRef} onScroll={normalizeLoopPosition}>
          {[...services, ...services].map(({ icon: Icon, title, text }, index) => (
            <motion.article
              key={`${title}-${index}`}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (index % services.length) * 0.08 }}
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

          <button
            type="button"
            className="services-scroll-btn services-scroll-btn-right"
            onClick={slideServicesForward}
            aria-label="Slide services"
          >
            <ChevronRight size={20} />
          </button>
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
        <p className="why-intro">
          Precision legal recording, certified translation and transcription services built for legal,
          corporate and institutional teams across South Africa.
        </p>
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

function TranslationOptions() {
  return (
    <section className="translation-section">
      <div className="container">
        <SectionTitle
          title="Translation Options"
          eyebrow="Choose your translation support"
        />

        <div className="translation-grid">
          <article className="translation-card">
            <h3>Language Requirement</h3>
            <p>
              Let us know whether your matter needs translation into another language, or whether no
              translation is required.
            </p>
          </article>

          <article className="translation-card">
            <h3>Request A Practitioner</h3>
            <p>
              Request a qualified legal translation practitioner for specialist legal documents and proceedings.
            </p>
          </article>

          <article className="translation-card">
            <h3>Outsourced Legal Translators</h3>
            <p>
              We can outsource to experienced legal translators to match your language and turnaround needs.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function FounderSection() {
  return (
    <section className="founder-section">
      <div className="container founder-grid">
        <div>
          <SectionTitle title="About The Founder" eyebrow="Leadership" />
          <p>
            Khanyisa was founded to deliver precision legal recording, certified translation and transcription
            services with professionalism, confidentiality and dependable turnaround.
          </p>
          <p>
            The founder's vision is to make legal language services accessible to professionals, firms,
            corporations and institutions that need trusted, high-quality outcomes.
          </p>
        </div>

        <article className="founder-highlight">
          <h3>Founder Focus</h3>
          <p><CheckCircle2 size={18} /> Legal quality standards</p>
          <p><CheckCircle2 size={18} /> Confidential client handling</p>
          <p><CheckCircle2 size={18} /> Strong national language support</p>
        </article>
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

function QuoteForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    matterType: "Court Proceedings",
    translationRequirement: "No translation required",
    translationSupport: "Request practitioner",
    turnaround: "Standard",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const isTranslationMatter =
    form.matterType === "Certified Translation" || form.matterType === "Media / Television Services";

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
            <p><Mail /> info@khanyisatranscribers.co.za</p>
            <p><MapPin /> South Africa</p>
          </div>
        </div>

        <form className="quote-form" onSubmit={SubmitQuote}>
          <div className="form-grid">
            <input
              value={form.name}
              onChange={(e) => UpdateField("name", e.target.value)}
              placeholder="Full Name"
              required
            />
            <input
              value={form.email}
              onChange={(e) => UpdateField("email", e.target.value)}
              placeholder="Email Address"
              type="email"
              required
            />
            <input
              value={form.phone}
              onChange={(e) => UpdateField("phone", e.target.value)}
              placeholder="Phone Number"
            />
            <div className="select-wrapper">
              <select value={form.matterType} onChange={(e) => UpdateField("matterType", e.target.value)}>
                <option>Court Proceedings</option>
                <option>Arbitration / CCMA</option>
                <option>Disciplinary Hearing</option>
                <option>Legal Dictation</option>
                <option>Certified Translation</option>
                <option>Media / Television Services</option>
              </select>
              <ChevronDown size={18} />
            </div>

            {isTranslationMatter && (
              <>
                <div className="select-wrapper full-width">
                  <select
                    value={form.translationRequirement}
                    onChange={(e) => UpdateField("translationRequirement", e.target.value)}
                  >
                    <option>No translation required</option>
                    <option>Translation required in another language</option>
                  </select>
                  <ChevronDown size={18} />
                </div>

                <div className="select-wrapper full-width">
                  <select
                    value={form.translationSupport}
                    onChange={(e) => UpdateField("translationSupport", e.target.value)}
                  >
                    <option>Request practitioner</option>
                    <option>Outsource legal translators</option>
                  </select>
                  <ChevronDown size={18} />
                </div>
              </>
            )}

            <div className="select-wrapper full-width">
              <select value={form.turnaround} onChange={(e) => UpdateField("turnaround", e.target.value)}>
                <option>Standard</option>
                <option>Urgent</option>
                <option>Same Day</option>
              </select>
              <ChevronDown size={18} />
            </div>
          </div>
          <textarea
            value={form.message}
            onChange={(e) => UpdateField("message", e.target.value)}
            placeholder="Tell us about your transcription request"
            required
          />
          <button type="submit" className="primary-button form-button">
            Submit Request
          </button>
          {submitted && (
            <p className="form-success">Quote request captured locally. Connect this form to your API or email service next.</p>
          )}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com", icon: Instagram },
    { label: "Facebook", href: "https://www.facebook.com", icon: Facebook },
    { label: "LinkedIn", href: "https://www.linkedin.com", icon: Linkedin },
  ];

  return (
    <footer id="contact" className="site-footer">
      <div className="container footer-container">
        <div className="footer-brand-block">
          <Logo />
          <p className="footer-quote"><span>"</span> We don't just type, we understand the law.</p>
        </div>

        <div className="footer-right-block">
          <div className="footer-socials" aria-label="Social media links">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                <Icon size={18} />
                <span>{label}</span>
              </a>
            ))}
          </div>

          <div className="footer-certifications" aria-label="Certifications">
            <p><BadgeCheck size={16} /> BEE Certification</p>
            <p><ShieldCheck size={16} /> SSL Certification</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <WhyChooseUs />
      <TranslationOptions />
      <FounderSection />
      <Pricing />
      <QuoteForm />
      <Footer />
    </main>
  );
}
