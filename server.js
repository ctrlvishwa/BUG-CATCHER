import express from 'express';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

// Load the hidden API key from the .env file
dotenv.config();

const app = express();
app.use(express.json());

// Serve the frontend files from a folder called "public"
app.use(express.static('public')); 

// Initialize Groq securely on the backend
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// The API endpoint your frontend will talk to
app.post('/api/analyze', async (req, res) => {
    try {
        const userCode = req.body.code;
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are an expert code reviewer. Analyze the code. Return a structured list of: 1. Bugs, 2. Security Issues, 3. Style Problems. Keep it concise." },
                { role: "user", content: userCode }
            ],
            model: "llama-3.1-8b-instant", // Fast, free open-source model
        });

        res.json({ result: chatCompletion.choices[0]?.message?.content });
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "Failed to analyze code on the server." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running securely on http://localhost:${PORT}`));
