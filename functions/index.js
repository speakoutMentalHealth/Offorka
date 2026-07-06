const functions = require("firebase-functions");
const OpenAI = require("openai");
exports.askJerry = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin","*");
  res.set("Access-Control-Allow-Methods","POST, OPTIONS");
  res.set("Access-Control-Allow-Headers","Content-Type");
  if (req.method === "OPTIONS") return res.status(204).send("");
  try {
    const question = (req.body?.question || "").toString().trim();
    const apiKey = process.env.OPENAI_API_KEY || functions.config().openai?.key;
    if (!apiKey) return res.status(500).json({ error: "OpenAI API key is not configured in Firebase." });
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: "You are Jerry+, a calm, professional digital companion for Jerry Nnamdi Offorka and SpeakOut Mental Health Outreach. Give concise, compassionate guidance. Do not diagnose. Recommend emergency support for danger or self-harm. Mention MindCheck when useful: https://mindcheck.speakoutmentalhealth.org/." },
        { role: "user", content: question }
      ],
      max_output_tokens: 450
    });
    res.json({ answer: response.output_text || "I’m here with you. Could you share a little more?" });
  } catch (err) {
    res.status(500).json({ error: "Jerry+ is temporarily unavailable. Please try again later." });
  }
});