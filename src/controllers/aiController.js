const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../utils/asyncHandler');
const User = require('../models/userModel');


const geminiApiCall = async (prompt) => {
  
    const apiKey = process.env.OPENAI_API_KEY || ""; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ "google_search": {} }],
        systemInstruction: {
            parts: [{ text: "You are Nova, a helpful, concise, and friendly AI assistant integrated into a chat application. Respond conversationally and summarize information clearly." }]
        },
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) {
             return "Sorry, I couldn't process that request right now.";
        }
        return text;

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new ApiError(503, "AI service temporarily unavailable.");
    }
}


const askAI = asyncHandler(async (req, res) => {
    const { prompt } = req.body;
    const userId = req.user._id;

    if (!prompt) {
        throw new ApiError(400, "Prompt cannot be empty.");
    }

    const aiReplyText = await geminiApiCall(prompt);


    res.standardSuccess({
        reply: aiReplyText,
        sender: {
            _id: 'AI_ASSISTANT_ID',
            name: 'Nova AI'
        }
    }, 'AI response generated successfully.');
});

module.exports = { askAI };