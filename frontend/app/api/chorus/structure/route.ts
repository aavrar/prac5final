import { NextResponse } from 'next/server';
import { getGeminiModel } from '@/lib/gemini';
import { getUserTensor } from '@/lib/db/tensor';

export async function POST(request: Request) {
    try {
        const { userId, particle, history } = await request.json();
        const tensor = await getUserTensor(userId);

        const prompt = `
        CONTEXT:
        A "Quantum Chorus" of AI agents (Architect, Poet, Critic) has been debating a story concept based on this User Tensor and Particle.
        
        USER TENSOR:
        - Motifs: ${tensor.creative_voice?.recurring_motifs?.join(', ')}
        - Emotion: ${tensor.emotional_landscape?.current_state?.dominant_emotion}

        PARTICLE (Constraint): "${particle}"

        DEBATE HIGHLIGHTS (Summary):
        ${history ? history.map((m: any) => `${m.agent}: ${m.content}`).join('\n') : "N/A (Generate new structure)"}

        TASK:
        Synthesize this into a strict 4-Beat Structure for parallel generation.
        
        OUTPUT FORMAT (JSON ONLY):
        {
            "title": "Story Title",
            "beats": [
                { "type": "Opening", "instruction": "Establish the setting and motif X. Tone: Y." },
                { "type": "Rising Action", "instruction": "Introduce the conflict. Pacing: Fast." },
                { "type": "Climax", "instruction": "The moment of decision. High metaphor density." },
                { "type": "Resolution", "instruction": "The aftermath. Ambiguous ending." }
            ]
        }
        `;

        const model = getGeminiModel();
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '');

        return NextResponse.json(JSON.parse(responseText));

    } catch (error) {
        console.error('Error generating structure:', error);
        return NextResponse.json({ error: 'Failed to structure story' }, { status: 500 });
    }
}
