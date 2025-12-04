import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
    try {
        const { user_id, title, content } = await request.json();

        if (!content || !user_id || !title) {
            return NextResponse.json({ error: 'Content, title, and user_id are required' }, { status: 400 });
        }

        const text = content;
        // const title = file.name.replace(/\.[^/.]+$/, ""); // No longer needed as title is passed explicitly

        // 1. Analyze with Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Analyze this story for "Quantum Storytelling" metadata. 
        Return a JSON object with:
        - themes: string[] (major themes)
        - emotional_valence: string (e.g., "Melancholic", "Hopeful")
        - motifs: string[] (recurring imagery)
        - cultural_markers: string[] (specific cultural references)
        
        Story:
        ${text.substring(0, 10000)}...`; // Truncate if too long

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let analysis = {};
        try {
            const jsonString = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            analysis = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse Gemini response", e);
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
