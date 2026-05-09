export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Nav />
      <Hero />
      <WhatItMonitors />
      <HowItWorks />
      <Install />
      <Footer />
    </div>
  );
}

/* ─── Nav ─────────────────────────────────────────────────────────────────── */
function Nav() {
  return (
    <nav
      className="flex items-center justify-between px-6 py-4 border-b"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <span className="font-bold text-lg tracking-tight">
        N<span style={{ color: "var(--accent-light)" }}>.</span>ext
      </span>
      <a
        href="#install"
        className="text-sm px-4 py-2 rounded font-medium"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        Add to Chrome
      </a>
    </nav>
  );
}

/* ─── Hero ─────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-24">
      <div
        className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
      >
        Chrome Extension · Free
      </div>

      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 max-w-2xl">
        You won&apos;t miss another<br />
        <span style={{ color: "var(--accent-light)" }}>opportunity at NUS</span>
      </h1>

      <p className="text-base max-w-xl mb-8" style={{ color: "var(--text-muted)" }}>
        N.ext watches Canvas, TalentConnect, Reddit r/NUS, NUS Scholarships, and Devpost — and
        fires a single notification the moment something relevant appears.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="#install"
          className="px-6 py-3 rounded font-semibold text-sm"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          Add to Chrome — it&apos;s free
        </a>
        <a
          href="#how"
          className="px-6 py-3 rounded font-semibold text-sm"
          style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)" }}
        >
          See how it works
        </a>
      </div>

      <div className="mt-16 w-full max-w-sm flex flex-col gap-2 text-left">
        {MOCK_NOTIFICATIONS.map((n, i) => (
          <MockCard key={i} {...n} />
        ))}
      </div>
    </section>
  );
}

const MOCK_NOTIFICATIONS = [
  { source: "TalentConnect", tag: "Internship", title: "Software Engineer Intern @ Shopee", time: "2m ago", tagColor: "#1a4731" },
  { source: "Reddit r/NUS", tag: "Scholarship", title: "PSA scholarship 2025 — applications open", time: "14m ago", tagColor: "#5a1e6e" },
  { source: "Canvas", tag: "Deadline", title: "CS3230 Problem Set 4 — due Fri 23:59", time: "1h ago", tagColor: "#0d419d" },
];

function MockCard({
  source,
  tag,
  title,
  time,
  tagColor,
}: {
  source: string;
  tag: string;
  title: string;
  time: string;
  tagColor: string;
}) {
  return (
    <div
      className="px-4 py-3 rounded-lg text-sm"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded"
          style={{ background: tagColor, color: "#e6edf3" }}
        >
          {tag}
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {source} · {time}
        </span>
      </div>
      <p className="font-medium" style={{ color: "var(--text)" }}>
        {title}
      </p>
    </div>
  );
}

/* ─── What it monitors ─────────────────────────────────────────────────────── */
const SOURCES = [
  {
    icon: "📋",
    name: "Canvas LMS",
    description:
      "Announcements, upcoming deadlines, and unread notifications — scraped the moment you open a Canvas page.",
  },
  {
    icon: "💼",
    name: "TalentConnect",
    description:
      "New internship listings with role title, company, deadline, and eligibility — captured when you visit the portal.",
  },
  {
    icon: "💬",
    name: "Reddit r/NUS",
    description:
      "Posts containing: internship, scholarship, application, deadline, bursary, SEP, exchange — filtered automatically.",
  },
  {
    icon: "🎓",
    name: "NUS Scholarships",
    description: "New scholarship listings scraped from the official scholarships page every 6 hours.",
  },
  {
    icon: "📰",
    name: "NUS News",
    description:
      "University announcements and news items — useful for hall openings, CCA deadlines, and admin notices.",
  },
  {
    icon: "🏆",
    name: "Devpost",
    description:
      "Upcoming hackathons tagged Singapore — so you never miss a team formation window.",
  },
];

function WhatItMonitors() {
  return (
    <section
      id="monitors"
      className="px-6 py-20 border-t"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="max-w-4xl mx-auto">
        <SectionLabel>What it monitors</SectionLabel>
        <h2 className="text-2xl md:text-3xl font-bold mb-10">Six sources. One feed.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SOURCES.map((s) => (
            <SourceCard key={s.name} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SourceCard({
  icon,
  name,
  description,
}: {
  icon: string;
  name: string;
  description: string;
}) {
  return (
    <div
      className="p-4 rounded-lg"
      style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-semibold mb-1 text-sm">{name}</h3>
      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
    </div>
  );
}

/* ─── How it works ─────────────────────────────────────────────────────────── */
const STEPS = [
  {
    number: "01",
    title: "Install and pick a preset",
    description:
      "Choose Freshman, Internship Hunter, or Scholarship Focused. Each preset activates the right sources for you. Toggle individual sources on or off any time.",
  },
  {
    number: "02",
    title: "Browse normally",
    description:
      "The extension reads Canvas and TalentConnect as you visit them. A background worker polls Reddit, NUS pages, and Devpost every 6 hours — no tab needed.",
  },
  {
    number: "03",
    title: "Get notified once, never twice",
    description:
      "Every item is fingerprinted. Duplicates are silently skipped. Hit \"Don't show like this\" on any alert and similar posts won't bother you again.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="px-6 py-20 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-3xl mx-auto">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="text-2xl md:text-3xl font-bold mb-10">Three steps, zero noise</h2>
        <div className="flex flex-col gap-8">
          {STEPS.map((step) => (
            <Step key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-5">
      <div
        className="font-mono text-xs font-bold w-8 pt-0.5 flex-shrink-0"
        style={{ color: "var(--accent-light)" }}
      >
        {number}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

/* ─── Install ──────────────────────────────────────────────────────────────── */
function Install() {
  return (
    <section
      id="install"
      className="px-6 py-24 border-t text-center"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="max-w-lg mx-auto">
        <SectionLabel>Get started</SectionLabel>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Free. No account. No login.</h2>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Install the extension, pick your preset, and let N.ext do the watching. Works on any NUS
          student Chrome browser.
        </p>
        <div
          className="inline-flex items-center gap-3 px-6 py-3 rounded font-semibold text-sm cursor-not-allowed select-none"
          style={{ background: "var(--accent)", color: "#fff", opacity: 0.7 }}
          title="Chrome Web Store listing coming soon"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Add to Chrome — coming to Web Store
        </div>
        <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
          While the Web Store review is pending, install via the{" "}
          <a
            href="https://github.com/anushakamran06/vroom"
            className="underline"
            style={{ color: "var(--accent-light)" }}
          >
            GitHub repo
          </a>{" "}
          using Developer Mode.
        </p>
      </div>
    </section>
  );
}

/* ─── Footer ───────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      className="px-6 py-8 border-t text-xs text-center"
      style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
    >
      N.ext is an independent student project and is not affiliated with the National University of
      Singapore.
    </footer>
  );
}

/* ─── Shared ───────────────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-semibold uppercase tracking-widest mb-3"
      style={{ color: "var(--accent-light)" }}
    >
      {children}
    </p>
  );
}
