import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserTensor } from '@/lib/db/tensor';

import { getGeminiModel } from '@/lib/gemini';

// Initialize Gemini
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
    try {
        const { userId, particle } = await request.json();
        const tensor = await getUserTensor(userId);

        const prompt = `
        You are a simulator for a "Quantum Chorus" of 3 AI Agents debating how to write a story.
        
        AGENTS:
        1. THE ARCHITECT (Blue): Obsessed with structure, plot beats, and causality. Logical.
        2. THE POET (Purple): Obsessed with imagery, sensory details, and metaphor. Emotional.
        3. THE CRITIC (Red): Obsessed with constraints, pacing, and avoiding clichés. Cynical.

        USER CONTEXT (The Tensor):
        - Recurring Motifs: ${tensor.creative_voice?.recurring_motifs?.join(', ')}
        - Emotional State: ${tensor.emotional_landscape?.current_state?.dominant_emotion}
        - Cultural Background: ${tensor.cultural_coordinates?.heritage?.map((h: any) => h.region).join(', ')}

        THE PARTICLE (The Constraint):
        "${particle}"

        TASK:
        Simulate a 6-turn conversation (approx) where they agree on a "Beat Sheet" for this story.
        They should discuss: The Opening, The Conflict, and The Ending.
        
        FORMAT:
        Output strictly as "NDJSON" (Newline Delimited JSON).
        One JSON object per line.
        NO markdown formatting. NO code blocks (\`\`\`). NO preamble.

            Example:
                { "agent": "Architect", "content": "I see a linear structure here. Beginning with the motif of Mirrors." }
        { "agent": "Critic", "content": "Too cliché. Let's start *in media res* instead." }
        { "agent": "Poet", "content": "The mirror isn't glass; it's water. A puddle in Sindh." }

        Make the dialogue feel fast, professional, and slightly futuristic.
        `;

        const model = getGeminiModel();

        const result = await model.generateContentStream({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();

                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    // Clean up markdown code blocks if the model adds them
                    const cleanChunk = chunkText.replace(/```json/g, '').replace(/```/g, '');
                    controller.enqueue(encoder.encode(cleanChunk));
                }
                controller.close();
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('Error in chorus debate:', error);
        return NextResponse.json({ error: 'Failed to initiate debate' }, { status: 500 });
    }
}
