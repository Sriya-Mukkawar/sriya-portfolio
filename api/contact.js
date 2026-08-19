const { sendContactEmail } = require("../lib/sendContactEmail");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

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

  return res.status(200).json({
    ok: true,
    message: "Thanks for reaching out. I’ll get back to you soon.",
  });
};
