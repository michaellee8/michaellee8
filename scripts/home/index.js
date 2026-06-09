const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const outDir = path.join(__dirname, "../../out/home");
const resumePath = path.join(__dirname, "../../resume.yaml");

const resume = yaml.load(fs.readFileSync(resumePath, "utf-8")).cv;
const experience = resume.sections.experience;
const previousExperience = experience.filter((role) => role.end_date);
const skills = resume.sections.skills;
const certificates = resume.sections.certificates;
const education = resume.sections.education[0];

const links = {
  github: "https://github.com/michaellee8",
  gitlab: "https://gitlab.com/michaellee8",
  linkedin: "https://linkedin.com/in/michaellee88",
};

const focusAreas = [
  {
    label: "Agentic AI systems",
    text: "Multi-stage workflows, code execution sandboxes, verifiable RAG, and production AI platforms.",
  },
  {
    label: "Product engineering",
    text: "React, Angular, mobile SDKs, voice agents, spreadsheet add-ins, and developer-facing tools.",
  },
  {
    label: "Backend and infrastructure",
    text: "FastAPI, Spring Boot, Golang, Redis, PostgreSQL, Kubernetes, AWS, GCP, and deployment pipelines.",
  },
];

const techGroups = [
  {
    label: "AI",
    items: ["LangChain", "LangGraph", "LlamaIndex", "pgvector", "LiveKit Agents", "Whisper", "llama.cpp", "MLX"],
  },
  {
    label: "Frontend",
    items: ["React", "Angular", "Tailwind", "office.js", "Playwright", "Selenium"],
  },
  {
    label: "Backend",
    items: ["Python", "FastAPI", "Golang", "Java", "Spring Boot", "Node.js", "Bun"],
  },
  {
    label: "Data and cloud",
    items: ["PostgreSQL", "MSSQL", "MySQL", "Redis", "AWS ECS", "EC2", "GCP", "Kubernetes"],
  },
  {
    label: "Mobile",
    items: ["React Native", "Flutter", "Android", "iOS", "SDK design"],
  },
];

const systemNodes = [
  "Voice Agents",
  "Sheets AI",
  "RAG Core",
  "Trading Apps",
  "Mobile SDKs",
  "Spring Boot",
  "React UI",
  "Golang APIs",
  "PostgreSQL",
  "Cloud",
];

const visualSignals = [
  "Voice Sim",
  "RAG Systems",
  "Trading Platforms",
  "Mobile SDKs",
  "Cloud Backends",
];

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripMarkdown(value) {
  return String(value ?? "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function cleanCopy(value) {
  return stripMarkdown(value)
    .replace(/\bassigments\b/gi, "assignments")
    .replace(/\bintergrated\b/gi, "integrated")
    .replace(/\bpolygot\b/gi, "polyglot");
}

function formatDate(value) {
  if (!value) {
    return "Present";
  }

  const [year, month] = String(value).split("-");
  if (!month) {
    return year;
  }

  const date = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function roleDates(role) {
  return `${formatDate(role.start_date)} - ${formatDate(role.end_date)}`;
}

function sentence(value) {
  const text = cleanCopy(value).trim();
  return text.endsWith(".") ? text : `${text}.`;
}

function initials(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function renderSocialLink(label, href) {
  return `<a class="link-button" href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
}

function renderRole(role, index) {
  const highlights = (role.highlights || []).slice(0, index === 0 ? 4 : 2);
  return `
    <article class="timeline-item">
      <div class="timeline-marker" aria-hidden="true"></div>
      <div class="timeline-copy">
        <div class="eyebrow">${escapeHtml(roleDates(role))} / ${escapeHtml(role.location || "Remote")}</div>
        <h3>${escapeHtml(role.position)} <span>@ ${escapeHtml(role.company)}</span></h3>
        ${role.summary ? `<p>${escapeHtml(sentence(role.summary))}</p>` : ""}
        ${
          highlights.length > 0
            ? `<ul>${highlights.map((highlight) => `<li>${escapeHtml(sentence(highlight))}</li>`).join("")}</ul>`
            : ""
        }
      </div>
    </article>
  `;
}

function renderTechGroup(group) {
  return `
    <section class="skill-group">
      <h3>${escapeHtml(group.label)}</h3>
      <div class="skill-list">
        ${group.items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    </section>
  `;
}

function renderCertificate(certificate) {
  const text = certificate.bullet || "";
  const match = text.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (match) {
    return `<a class="credential" href="${escapeHtml(match[2])}">${escapeHtml(match[1])}</a>`;
  }

  return `<span class="credential">${escapeHtml(stripMarkdown(text))}</span>`;
}

function renderPage() {
  const title = "Michael Lee - Agentic AI and Full-Stack Engineer";
  const description =
    "Michael Lee is a Hong Kong based full-stack engineer focused on agentic AI systems, product engineering, backend platforms, mobile SDKs, and cloud infrastructure.";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(resume.website)}">
  <link rel="canonical" href="${escapeHtml(resume.website)}">
  <link rel="stylesheet" href="style.css">
  <script src="script.js" defer></script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="#top" aria-label="Michael Lee homepage">
      <span>${escapeHtml(initials(resume.name))}</span>
      <strong>${escapeHtml(resume.name)}</strong>
    </a>
    <nav aria-label="Primary navigation">
      <a href="#work">Work</a>
      <a href="#stack">Stack</a>
      <a href="#credentials">Credentials</a>
    </nav>
  </header>

  <main id="top">
    <section class="hero section-band">
      <div class="hero-copy">
        <p class="eyebrow">${escapeHtml(resume.location)} / Agentic AI systems / Full-stack product engineering</p>
        <h1>${escapeHtml(resume.name)}</h1>
        <p class="lede">Full-stack engineer building production AI systems across agents, product interfaces, backend platforms, mobile SDKs, and cloud infrastructure.</p>
        <div class="hero-actions" aria-label="Contact and profile links">
          <a class="primary-button" href="${escapeHtml(links.github)}">View GitHub</a>
          ${renderSocialLink("LinkedIn", links.linkedin)}
          ${renderSocialLink("GitLab", links.gitlab)}
        </div>
      </div>
      <div class="system-visual" aria-label="Interactive systems map">
        <canvas id="system-map" data-nodes="${escapeHtml(JSON.stringify(systemNodes))}"></canvas>
        <div class="visual-panel">
          <span class="status-light" aria-hidden="true"></span>
          <span>Selected systems</span>
          <strong>${escapeHtml(visualSignals.join(" / "))}</strong>
        </div>
      </div>
    </section>

    <section class="focus-strip" aria-label="Focus areas">
      ${focusAreas
        .map(
          (area) => `
        <article>
          <h2>${escapeHtml(area.label)}</h2>
          <p>${escapeHtml(area.text)}</p>
        </article>
      `,
        )
        .join("")}
    </section>

    <section class="section-band timeline-section" id="work">
      <div class="section-heading split-heading">
        <div>
          <p class="eyebrow">Previous roles</p>
          <h2>Work across AI startups, finance, education, developer platforms, mobile, and backend systems.</h2>
        </div>
      </div>
      <div class="timeline">
        ${previousExperience.map(renderRole).join("")}
      </div>
    </section>

    <section class="section-band stack-section" id="stack">
      <div class="section-heading">
        <p class="eyebrow">Technical range</p>
        <h2>Comfortable across the full AI application stack.</h2>
      </div>
      <div class="skills-layout">
        ${techGroups.map(renderTechGroup).join("")}
      </div>
      <div class="profile-skills" aria-label="Skill summary">
        ${skills
          .map(
            (skill) => `
          <p><strong>${escapeHtml(skill.label)}:</strong> ${escapeHtml(skill.details)}</p>
        `,
          )
          .join("")}
      </div>
    </section>

    <section class="section-band credentials-section" id="credentials">
      <div class="section-heading split-heading">
        <div>
          <p class="eyebrow">Credentials</p>
          <h2>${escapeHtml(education.degree)} in ${escapeHtml(education.area)}, ${escapeHtml(education.institution)}.</h2>
        </div>
        <p>${escapeHtml(formatDate(education.start_date))} - ${escapeHtml(formatDate(education.end_date))} / ${escapeHtml(education.location)}</p>
      </div>
      <div class="credential-row">
        ${certificates.map(renderCertificate).join("")}
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p>Building agentic AI systems from ${escapeHtml(resume.location)}.</p>
    <div>
      <a href="${escapeHtml(links.github)}">GitHub</a>
      <a href="${escapeHtml(links.gitlab)}">GitLab</a>
      <a href="${escapeHtml(links.linkedin)}">LinkedIn</a>
    </div>
  </footer>
</body>
</html>`;
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "index.html"), renderPage());
