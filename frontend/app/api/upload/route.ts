import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
    try {

        const { user_id, title, content, analysis: providedAnalysis } = await request.json();

        if (!content || !user_id || !title) {
            return NextResponse.json({ error: 'Content, title, and user_id are required' }, { status: 400 });
        }

        const text = content;
        let analysis = providedAnalysis || {};

        // Only analyze if not provided and not explicitly skipped (empty object passed)
        // If providedAnalysis is null/undefined, we might want to try analyzing, 
        // but for this new flow, we prefer the client to handle it. 
        // We'll keep the fallback logic just in case, but prioritize providedAnalysis.

        if (!providedAnalysis) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                // ... (existing analysis logic could remain as a fallback, or we remove it to enforce the new flow)
                // For now, let's keep a simplified fallback or just default to empty to respect the "continue without analysis"
                // If the user chose "without analysis", the client should pass an empty object or specific flag.
                // Let's assume if providedAnalysis is missing, we default to empty to avoid double-cost/latency unless we really want it.
                // actually, let's keep the fallback for direct API usage, but make it robust.

                const prompt = `Analyze this story...`; // simplified for brevity in this thought process
                // ...
            } catch (e) {
                // ...
            }
        }

        // REPLACING THE BLOCK WITH:

        if (!providedAnalysis) {
            // Fallback: Try to analyze if not provided (e.g. direct API call)
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const prompt = `Analyze this story for "Quantum Storytelling" metadata. 
                Return a JSON object with:
                - themes: string[]
                - emotional_valence: string
                - motifs: string[]
                - cultural_markers: string[]
                
                Story:
                ${text.substring(0, 5000)}...`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const jsonString = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                analysis = JSON.parse(jsonString);
            } catch (e) {
                console.log("Backend analysis fallback failed, using heuristics", e);

                // Heuristic fallback
                const themes = ["Memory", "Identity", "Time", "Nature", "Technology"];
                const detectedThemes = themes.filter(t => text.toLowerCase().includes(t.toLowerCase()));

                analysis = {
                    themes: detectedThemes.length > 0 ? detectedThemes : ["Uncategorized"],
                    emotional_valence: text.length > 1000 ? "Complex" : "Neutral",
                    motifs: ["Light", "Shadow", "Water"].filter(m => text.toLowerCase().includes(m.toLowerCase())),
                    cultural_markers: []
                };
            }
        }

        // 2. Save to MongoDB
        const db = await getDatabase();
        const story = {
            user_id: user_id,
            title,
            content: text,
            type: 'uploaded',
            analysis,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const insertResult = await db.collection('stories').insertOne(story);

        // 3. Update User Tensor (Mock implementation for now - normally would recalculate weights)
        // In a real app, we would fetch the current tensor, update weights based on analysis, and save back.

        return NextResponse.json({
            success: true,
            story_id: insertResult.insertedId,
            analysis
        });

    } catch (error: any) {
        console.error('Error uploading story:', error);
        return NextResponse.json({
            error: 'Failed to upload story',
            details: error.message
        }, { status: 500 });
    }
}
