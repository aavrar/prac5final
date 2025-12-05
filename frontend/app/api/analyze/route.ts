import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const { content } = await request.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const prompt = `Analyze this story for "Quantum Storytelling" metadata. 
        Return a JSON object with:
        - themes: string[] (major themes, max 5)
        - emotional_valence: string (e.g., "Melancholic", "Hopeful", "Tense", "Joyful", "Nostalgic")
        - motifs: string[] (recurring imagery, max 5)
        - cultural_markers: string[] (specific cultural references)
        
        Story:
        ${content.substring(0, 10000)}...`;

        const jsonString = await generateText(prompt);
        const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(cleanJson);

        return NextResponse.json({ success: true, analysis });

    } catch (error: any) {
        console.error('Analysis failed:', error);

        // Fallback to heuristic analysis
        const text = (await request.json()).content || "";
        const themes = ["Memory", "Identity", "Time", "Nature", "Technology"];
        const detectedThemes = themes.filter(t => text.toLowerCase().includes(t.toLowerCase()));

        const heuristicAnalysis = {
            themes: detectedThemes.length > 0 ? detectedThemes : ["Uncategorized"],
            emotional_valence: text.length > 1000 ? "Complex" : "Neutral",
            motifs: ["Light", "Shadow", "Water"].filter(m => text.toLowerCase().includes(m.toLowerCase())),
            cultural_markers: []
        };

        return NextResponse.json({
            success: true,
            analysis: heuristicAnalysis,
            is_heuristic: true
        });
    }
}
