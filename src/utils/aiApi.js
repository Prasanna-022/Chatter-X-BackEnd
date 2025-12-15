
const geminiApiCall = async (prompt) => {

    const apiKey = process.env.OPENAI_API_KEY;
    const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
    const MODEL_NAME = "google/gemini-2.5-flash";

    if (!apiKey) {
        throw new Error("AI API key is missing from environment variables.");
    }


    const payload = JSON.stringify({

        "model": MODEL_NAME,
        "messages": [
            {
                "role": "system",
                "content": "You are Nova AI, a helpful, fast, and friendly assistant in a real-time chat application. Be brief and direct."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],

        "max_tokens": 500
    });

    try {
        
        const response = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,

                "Content-Type": "application/json"
            },
            body: payload
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("OpenRouter API Error:", response.status, errorBody);

            throw new Error("AI service temporarily unavailable due to API error or invalid key.");
        }

        const result = await response.json();

        const text = result.choices?.[0]?.message?.content;

        if (!text) {
            return "Sorry, I couldn't generate a response right now.";
        }
        return text;

    } catch (error) {
        console.error("Network or Processing Error:", error);
        throw new ApiError(503, "AI service temporarily unavailable.");
    }
};