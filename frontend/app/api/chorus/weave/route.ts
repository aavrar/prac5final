import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const { threads, title } = await request.json();

        // Sort threads to be sure
        const sorted = threads.sort((a: any, b: any) => a.index - b.index);
        const fullText = sorted.map((t: any) => t.content).join('\n\n');

        const prompt = `
        You are "THE WEAVER", an AI editor responsible for Narrative Cohesion.
        
        You have been given 4 paragraphs of a story written by parallel agents.
        They may have inconsistent tones or disjointed transitions.
        
        STORY TITLE: ${title}

        DRAFT CONTENT:
        ${fullText}

        TASK:
        Rewrite this into a seamless, polished short story.
        1. Smooth the transitions between paragraphs.
        2. Ensure the "Voice" is consistent (Unified Tense/POV).
        3. fix any plot contradictions introduced by parallel generation.
        4. Keep the original imagery and plot points.
        
        Output strictly the final polished prose.
        `;

        const model = getGeminiModel();
        const result = await model.generateContent(prompt);

        return NextResponse.json({
            success: true,
            story: result.response.text()
        });

    } catch (error) {
        console.error('Error weaving story:', error);
        return NextResponse.json({ error: 'Weaving Failed' }, { status: 500 });
    }
}
