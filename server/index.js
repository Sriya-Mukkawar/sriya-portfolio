import express from "express";
import cors from "cors";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { sendContactEmail } = require("../lib/sendContactEmail.js");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, name: "Sriya Mukkawar Portfolio API" });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      ok: false,
      error: "Name, email, and message are required.",
    });
  }

  try {
    await sendContactEmail({ name, email, message });
  } catch (err) {
    console.error("Contact email failed:", err);
    return res.status(502).json({
      ok: false,
      error: err.message || "Could not send your message.",
    });
  }

  res.json({
    ok: true,
    message: "Thanks for reaching out. I’ll get back to you soon.",
  });
});

const clientDist = path.join(__dirname, "../client/dist");
app.use(express.static(clientDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`Portfolio server running on http://localhost:${PORT}`);
});
