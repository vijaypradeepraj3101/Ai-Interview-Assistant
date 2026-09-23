import axios from "axios";

export const askAi = async (messages) => {
  try {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Messages array is empty.");
    }

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is missing.");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response?.data?.choices?.[0]?.message?.content;

    if (!content || !String(content).trim()) {
      throw new Error("AI returned empty response.");
    }

    return content.trim();
  } catch (error) {
    console.error("OpenRouter Error:", error?.response?.data || error.message);

    const message =
      error?.response?.data?.error?.message ||
      error?.response?.data?.message ||
      error.message ||
      "OpenRouter API Error";

    throw new Error(message);
  }
};