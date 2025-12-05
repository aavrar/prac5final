import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { generateText } from '@/lib/gemini';
import { getUserTensor } from '@/lib/db/tensor';

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const tensor = await getUserTensor(userId);

        const prompt = `You are a "Literary Mirror". Your task is to invent a new story concept that fits perfectly within the user's established creative identity.

        USER CREATIVE IDENTITY:
        - Recurring Motifs: ${tensor.creative_voice?.recurring_motifs?.join(', ') || 'None'}
        - Emotional Landscape: ${tensor.emotional_landscape?.current_state?.dominant_emotion || 'Neutral'}
        - Syntax Rhythm: ${tensor.creative_voice?.syntax_rhythm || 'Standard'}
        - Cultural Markers: ${tensor.cultural_coordinates?.traditions?.join(', ') || 'None'}

        TASK:
        Invent a story that this user *would* write, but hasn't yet.
        
        OUTPUT FORMAT (JSON):
        {
            "title": "A poetic, evocative title",
            "premise": "A 2-sentence hook describing the core conflict and theme.",
            "opening": "The first paragraph of the story (approx 50-70 words), written EXACTLY in the user's voice (mimicking their syntax and diction)."
        }
        
        Return ONLY the JSON.`;

        const jsonString = await generateText(prompt);
        const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        const story = JSON.parse(cleanJson);

        return NextResponse.json(story);
    } catch (error) {
        console.error('Error generating unwritten story:', error);
        return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
    }
}
