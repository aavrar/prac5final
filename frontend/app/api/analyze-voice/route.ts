import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { generateText } from '@/lib/gemini';
import { getUserTensor } from '@/lib/db/tensor';

export async function POST(request: Request) {
    try {
        const { userId, text }: { userId: string; text: string } = await request.json();

        if (!userId || !text) {
            return NextResponse.json({ error: 'User ID and text are required' }, { status: 400 });
        }

        const tensor = await getUserTensor(userId);

        const prompt = `You are a "Literary Voice Analyst".
        
        USER VOICE PROFILE (The "User Tensor"):
        - Syntax Rhythm: ${tensor.creative_voice?.syntax_rhythm || 'Standard'}
        - Diction: ${tensor.creative_voice?.diction || 'Neutral'}
        - Metaphor Density: ${tensor.creative_voice?.metaphor_density || 'Medium'}
        - Recurring Motifs: ${tensor.creative_voice?.recurring_motifs?.join(', ') || 'None'}

        TEXT TO ANALYZE:
        "${text}"

        TASK:
        Analyze if the text matches the user's established voice profile.
        
        OUTPUT FORMAT:
        Return a JSON object:
        {
            "match_score": number (0-100),
            "feedback": "A concise, constructive critique (max 2 sentences). Focus on what is missing or different (e.g. 'This is too plain; your voice usually employs more complex syntax.')",
            "suggestion": "A specific suggestion to align it better (e.g. 'Try injecting a metaphor about mirrors here.')"
        }
        `;

        const jsonString = await generateText(prompt);
        const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(cleanJson);

        return NextResponse.json(analysis);
    } catch (error) {
        console.error('Error analyzing voice:', error);
        return NextResponse.json({ error: 'Failed to analyze voice' }, { status: 500 });
    }
}
