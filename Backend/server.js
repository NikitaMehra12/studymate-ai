const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Initialize middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const MODEL_NAME = "gemini-3.5-flash-lite";
console.log("Gemini model selected:", MODEL_NAME); 
// Test route
app.get("/", (req, res) => {
    res.json({
        message: "StudyMate AI Backend is running successfully!"
    });
});

// Gemini AI Study Planner API
app.post("/api/generate-study-plan", async (req, res) => {

    try {
        const {
            subject,
            dailyHours,
            startDate,
            examDate,
            preparationLevel,
            topics
        } = req.body;

        // Validate input
        if (
            !subject ||
            !dailyHours ||
            !startDate ||
            !examDate ||
            !preparationLevel ||
            !topics
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required study details."
            });
        }

        if (
            !Array.isArray(topics) ||
            topics.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide at least one study topic."
            });
        }

        if (
            !Number.isFinite(Number(dailyHours)) ||
            Number(dailyHours) < 1 ||
            Number(dailyHours) > 12
        ) {
            return res.status(400).json({
                success: false,
                message: "Daily study hours must be between 1 and 12."
            });
        }

        if (
            !Number.isFinite(Date.parse(startDate)) ||
            !Number.isFinite(Date.parse(examDate)) ||
            examDate <= startDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid study and exam dates."
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "Gemini API key is not configured."
            });
        }

        // Import Gemini SDK
        const { GoogleGenAI } = await import("@google/genai");

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        // Create AI prompt
        const prompt = `
You are an expert academic study planner.

Create a realistic and personalized study timetable using these details:

Subject: ${subject}
Daily study hours: ${dailyHours}
Start date: ${startDate}
Exam date: ${examDate}
Preparation level: ${preparationLevel}
Topics: ${topics.join(", ")}

Instructions:
1. Create a day-by-day study timetable.
2. Distribute all topics logically.
3. Give more attention to difficult topics.
4. Include revision and practice sessions.
5. Include mock tests near the exam date.
6. Do not schedule dates outside the preparation period.
7. Respect the available daily study hours.
8. Keep the timetable realistic.

Return ONLY valid JSON in this exact structure:

{
    "subject": "${subject}",
    "dailyHours": ${Number(dailyHours)},
    "preparationLevel": "${preparationLevel}",
    "startDate": "${startDate}",
    "examDate": "${examDate}",
    "totalDays": 0,
    "schedule": [
        {
            "date": "YYYY-MM-DD",
            "topics": ["Topic 1"],
            "activity": "Study and practice",
            "durationHours": 2
        }
    ]
}

Make sure the JSON is valid and contains no markdown formatting.
`;

        // Generate timetable using Gemini with automatic retries
        let response;
        const maxAttempts = 3;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                response = await ai.models.generateContent({
                    model: MODEL_NAME,
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json"
                    }
                });

                break;

            } catch (error) {
                if (error.status === 503 && attempt < maxAttempts) {
                    console.log(
                        `Gemini is overloaded. Retrying... Attempt ${attempt + 1}`
                    );

                    await new Promise(resolve =>
                        setTimeout(resolve, attempt * 3000)
                    );

                } else {
                    throw error;
                }
            }
        }

        // Convert AI response into JSON
        const studyPlan = JSON.parse(response.text);

        // Validate generated timetable
        if (
            !studyPlan.schedule ||
            !Array.isArray(studyPlan.schedule) ||
            studyPlan.schedule.length === 0
        ) {
            throw new Error("Gemini returned an invalid timetable.");
        }

        // Send timetable to frontend
        res.json({
            success: true,
            message: "AI study timetable generated successfully!",
            studyPlan: studyPlan
        });

    } catch (error) {

        console.error("Gemini API Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to generate the AI study plan. Please try again.",
            error: error.message
        });
    }
});

// ========================================
// GEMINI AI CHAT ASSISTANT API
// ========================================

app.post("/api/chat", async (req, res) => {

    try {

        const { message } = req.body;

        // Validate message
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter a message."
            });
        }

        // Initialize Gemini
        const { GoogleGenAI } = await import("@google/genai");

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        // AI instructions
        const prompt = `
You are StudyMate AI, a friendly academic study assistant.

Your purpose is to help college students with:
- Understanding academic concepts
- Explaining difficult topics in simple language
- Exam preparation
- Study strategies and productivity
- Solving academic doubts step by step

Keep your explanations clear, accurate and beginner-friendly.

Student's question:
${message}
`;

        // Generate AI response
        let response;
        const maxAttempts = 3;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {

            try {

                response = await ai.models.generateContent({
                    model: MODEL_NAME,
                    contents: prompt
                });

                break;

            } catch (error) {

                if (error.status === 503 && attempt < maxAttempts) {

                    console.log(
                        `Gemini is overloaded. Retrying chat... Attempt ${attempt + 1}`
                    );

                    await new Promise(resolve =>
                        setTimeout(resolve, attempt * 3000)
                    );

                } else {
                    throw error;
                }
            }
        }

        // Send response to frontend
        res.json({
            success: true,
            reply: response.text
        });

    } catch (error) {

        console.error("Gemini Chat Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to get an AI response. Please try again."
        });

    }

});
// Start backend server
app.listen(PORT, () => {
    console.log("Gemini API Key Loaded:", Boolean(process.env.GEMINI_API_KEY));
    console.log(`StudyMate AI Backend running at http://localhost:${PORT}`);
});