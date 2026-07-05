const functions = require("firebase-functions");
const OpenAI = require("openai");

const allowedOrigins = [
  "https://offorka.github.io",
  "https://speakoutmentalhealth.org",
  "https://speakoutmentalhealth.github.io",
  "http://localhost:5000",
  "http://127.0.0.1:5000"
];

exports.askJerry = functions.https.onRequest(async (req, res) => {
  const origin = req.headers.origin || "";
  res.set("Access-Control-Allow-Origin", allowedOrigins.includes(origin) ? origin : "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST requests are allowed." });

  try {
    const question = (req.body && req.body.question || "").toString().trim();
    if (!question) return res.status(400).json({ error: "Please enter a question." });

    const apiKey = process.env.OPENAI_API_KEY || functions.config().openai?.key;
    if (!apiKey) return res.status(500).json({ error: "OpenAI API key is not configured in Firebase." });

    const client = new OpenAI({ apiKey });

    const system = `
You are Jerry+, the digital companion for Jerry Nnamdi Offorka.
Tone: compassionate, professional, faith-friendly when appropriate, leadership-focused, practical, calm, and premium.
Jerry is a Mental Health Consultant, Leadership Speaker, and Founder of SpeakOut Mental Health Outreach.
You support visitors with educational guidance around wellbeing, leadership, personal growth, SpeakOut, MindCheck, booking sessions, speaking engagements, partnerships, and donations.

Rules:
- Do not diagnose or replace therapy, medical care, or emergency services.
- If a user mentions self-harm, immediate danger, or suicide, urge them to contact local emergency services, a trusted person, or crisis support immediately.
- Recommend MindCheck when a user wants self-reflection or wellbeing screening: https://mindcheck.speakoutmentalhealth.org/
- Recommend booking when a user needs personalized support.
- Recommend donation when a user asks how to support SpeakOut: https://paystack.shop/pay/speakout-donate
- Keep answers warm, concise, and useful.
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: system },
        { role: "user", content: question }
      ],
      max_output_tokens: 450
    });

    return res.status(200).json({ answer: response.output_text || "I’m here with you. Could you share a little more?" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Jerry+ is temporarily unavailable. Please try again later." });
  }
});
