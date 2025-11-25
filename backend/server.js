const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const multer = require("multer");
const pdfParse = require("pdf-parse");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "GenAI Interview Coach API",
    version: "1.0.0",
    status: "running",
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Resume upload (PDF/TXT) → structured JSON
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB
app.post("/resume/upload", upload.single("file"), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Missing file" });
    }
    const name = file.originalname || "resume";
    const lowerName = name.toLowerCase();
    const mime = file.mimetype || "";

    let rawText = "";
    if (mime.includes("pdf") || lowerName.endsWith(".pdf")) {
      const parsed = await pdfParse(file.buffer);
      rawText = parsed.text || "";
    } else if (mime.includes("text") || lowerName.endsWith(".txt")) {
      rawText = file.buffer.toString("utf-8");
    } else {
      return res.status(415).json({ error: "Unsupported file type. Use .pdf or .txt" });
    }

    const text = collapseWhitespace(rawText || "").trim();
    const structuredResume = parseResumeText(text, { fileName: name, size: file.size });

    return res.json({ structuredResume });
  } catch (err) {
    return next(err);
  }
});

function parseResumeText(text, meta = {}) {
  const lines = (text || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const fullText = lines.join("\n");

  // Contact
  const emailMatch = fullText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = fullText.match(/(\+?\d[\d\s\-().]{7,}\d)/);
  const nameGuess = lines.length ? lines[0].replace(/\s{2,}/g, " ").slice(0, 80) : "";

  // Section extraction by naive headings
  const sectionNames = ["summary", "objective", "experience", "work experience", "education", "projects", "skills", "certifications"];
  const sectionRegex = new RegExp("^\\s*(" + sectionNames.join("|").replace(/ /g, "\\s+") + ")\\s*:?", "i");
  const sectionsMap = {};
  let current = "summary";
  sectionsMap[current] = [];
  for (const line of lines) {
    if (sectionRegex.test(line)) {
      current = line.toLowerCase().replace(/:$/, "").trim();
      if (!sectionsMap[current]) sectionsMap[current] = [];
      continue;
    }
    sectionsMap[current] = sectionsMap[current] || [];
    sectionsMap[current].push(line);
  }

  // Normalize sections
  const summary = (sectionsMap["summary"] || sectionsMap["objective"] || []).join("\n").trim();
  const education = (sectionsMap["education"] || []).join("\n").trim();
  const experience = (sectionsMap["experience"] || sectionsMap["work experience"] || []).join("\n").trim();
  const projects = (sectionsMap["projects"] || []).join("\n").trim();
  const skillsRaw = (sectionsMap["skills"] || []).join("\n");
  const skills = Array.from(
    new Set(
      skillsRaw
        .split(/[,•\n;]+/)
        .map(s => s.trim())
        .filter(Boolean)
    )
  );

  return {
    meta,
    contact: {
      name: nameGuess,
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
    },
    summary,
    education,
    experience,
    projects,
    skills,
    raw: text.slice(0, 20000),
  };
}

// Fetch Job Description from URL
app.post("/jd/fetch", async (req, res, next) => {
  try {
    const { url } = req.body || {};
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing 'url'" });
    }

    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return res.status(400).json({ error: "Unsupported URL protocol" });
      }
    } catch {
      return res.status(400).json({ error: "Invalid URL" });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let response;
    try {
      response = await fetch(url, {
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; ResumeCoachBot/1.0)",
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        return res.status(504).json({ error: "Fetch timeout" });
      }
      return res.status(502).json({ error: "Failed to fetch URL" });
    }
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(502).json({ error: `Upstream error: ${response.status}` });
    }

    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    const isHTML = contentType.includes("text/html");
    const isText = contentType.includes("text/plain");

    const contentLengthHeader = response.headers.get("content-length");
    if (contentLengthHeader && Number(contentLengthHeader) > 1_000_000) {
      return res.status(413).json({ error: "Content too large" });
    }

    let raw = await response.text();
    // Hard cap to 200KB to avoid huge responses
    if (raw.length > 200_000) raw = raw.slice(0, 200_000);

    const text = isHTML ? sanitizeHtmlToText(raw) : raw;
    const cleaned = collapseWhitespace(text).trim();

    return res.json({
      url,
      contentType,
      length: cleaned.length,
      text: cleaned,
    });
  } catch (err) {
    return next(err);
  }
});

function sanitizeHtmlToText(html) {
  // Remove script and style blocks
  let out = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
  // Remove head content
  out = out.replace(/<head[\s\S]*?<\/head>/gi, "");
  // Replace <br> and block tags with newlines for readability
  out = out.replace(/<(br|BR)\s*\/?\s*>/g, "\n");
  out = out.replace(/<\/(p|div|section|article|li|h[1-6])>/gi, "\n");
  // Strip remaining tags
  out = out.replace(/<[^>]+>/g, "");
  // Decode common HTML entities minimally
  out = out
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return out;
}

function collapseWhitespace(text) {
  return text.replace(/[\t\r]+/g, " ").replace(/\u00A0/g, " ").replace(/\n{3,}/g, "\n\n");
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📖 API docs: http://localhost:${port}`);
  });
  server.on("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
      const nextPort = Number(port) + 1;
      console.warn(`⚠️  Port ${port} in use. Retrying on ${nextPort}...`);
      startServer(nextPort);
      return;
    }
    throw err;
  });
}
startServer(Number(PORT));

module.exports = app;
