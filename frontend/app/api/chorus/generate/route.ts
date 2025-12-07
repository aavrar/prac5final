import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';
import { getUserTensor } from '@/lib/db/tensor';

export const maxDuration = 60; // Allow longer timeout for parallel generation

export async function POST(request: Request) {
    try {
        const { userId, beats, title } = await request.json();
        const tensor = await getUserTensor(userId);

        const model = getGeminiModel();

        // Helper to generate one beat
        const generateBeat = async (beat: any, index: number) => {
            const prompt = `
            You are a "Quantum Thread" writing ONE specific part of a short story.
            
            STORY TITLE: ${title}
            
            FULL STRUCTURE (For Context):
            1. Opening: ${beats[0].instruction}
            2. Rising Action: ${beats[1].instruction}
            3. Climax: ${beats[2].instruction}
            4. Resolution: ${beats[3].instruction}

            YOUR TASK:
            Write strictly SECTION ${index + 1}: ${beat.type}.
            
            STYLE GUIDELINES (From User Tensor):
            - Syntax: ${tensor.creative_voice?.syntax_rhythm}
            - Diction: ${tensor.creative_voice?.diction}
            - Motifs to weave in: ${tensor.creative_voice?.recurring_motifs?.join(', ')}

            INSTRUCTION FOR THIS SECTION:
            ${beat.instruction}

            Output strictly the prose for this section. No intro, no meta-commentary.
            `;

            const result = await model.generateContent(prompt);
            return {
                type: beat.type,
                content: result.response.text(),
                index: index
            };
        };

        // Fire all threads simultaneously (Quantum Parallelism)
        const threads = beats.map((beat: any, index: number) => generateBeat(beat, index));
        const results = await Promise.all(threads);

        // Sort by index just in case, though Promise.all preserves order
        const sortedResults = results.sort((a, b) => a.index - b.index);

        return NextResponse.json({
            success: true,
            threads: sortedResults
        });

    } catch (error) {
        console.error('Error in parallel generation:', error);
        return NextResponse.json({ error: 'Quantum Collapse Failed' }, { status: 500 });
    }
}
