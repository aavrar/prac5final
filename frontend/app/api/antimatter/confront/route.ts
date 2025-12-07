import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const { antimatter } = await request.json();

        // If they haven't deleted much, give a generic dare
        const deletedText = antimatter.join('\n');

        const prompt = `
        You are the "Antimatter Engine", a psychological creative writing coach.
        
        CONTEXT:
        The user has been writing, but they keep deleting text. 
        Here is the text they destroyed/deleted:
        "${deletedText}"

        TASK:
        1. Analyze WHY they might be deleting this (Insecurity? Cliche? Too painful?).
        2. Generate a "Shadow Dare" - a prompt that forces them to write exactly what they are avoiding, but from a new angle.
        
        OUTPUT FORMAT (JSON):
        {
            "insight": "You seem to be avoiding...",
            "dare": "Write the scene again, but this time..."
        }
        `;

        const model = getGeminiModel();
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Clean markdown if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return NextResponse.json(JSON.parse(jsonStr));

    } catch (error) {
        console.error('Error confronting shadow:', error);
        return NextResponse.json({
            insight: " The Shadow is silent.",
            dare: "Write what you are afraid to know."
        });
    }
}
