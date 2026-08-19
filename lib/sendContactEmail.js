const TO_EMAIL = process.env.CONTACT_EMAIL || "mukkawarsriya@gmail.com";

async function sendContactEmail({ name, email, message }) {
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(TO_EMAIL)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        _subject: `New portfolio message from ${name.trim()}`,
        _replyto: email.trim(),
        _template: "table",
        _captcha: false,
      }),
    }
  );

  const data = await response.json().catch(() => ({}));
  const failed =
    !response.ok || data.success === false || data.success === "false";

  if (failed) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : "Could not send your message. Please email me directly."
    );
  }

  return data;
}

module.exports = { sendContactEmail, TO_EMAIL };
