import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

  console.log("Using API Key:", apiKey ? `${apiKey.substring(0, 7)}...` : "UNDEFINED");
  console.log("Using Model:", model);

  if (!apiKey) {
    console.error("Chưa cấu hình GEMINI_API_KEY");
    return;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: "Hello, this is a test. Reply with 'OK' if you receive this." }],
          },
        ],
      }),
    });

    console.log("HTTP Response Status:", response.status, response.statusText);
    const data = await response.json();
    console.log("HTTP Response Data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error occurred while calling Gemini API:", error);
  }
}

testGemini();
