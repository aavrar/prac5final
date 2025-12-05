import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { generateText } from '@/lib/gemini';
import { getUserTensor } from '@/lib/db/tensor';

export async function POST(request: Request) {
    try {
        const { userId, text } = await request.json();

        if (!userId || !text) {
            return NextResponse.json({ error: 'User ID and text are required' }, { status: 400 });
        }

        const tensor = await getUserTensor(userId);

        const prompt = `You are a "Style Transfer Engine".
        
        TARGET VOICE PROFILE:
        - Syntax Rhythm: ${tensor.creative_voice?.syntax_rhythm || 'Standard'}
        - Diction: ${tensor.creative_voice?.diction || 'Neutral'}
        - Metaphor Density: ${tensor.creative_voice?.metaphor_density || 'Medium'}
        - Recurring Motifs: ${tensor.creative_voice?.recurring_motifs?.join(', ') || 'None'}

        INPUT TEXT:
        "${text}"

        TASK:
        Rewrite the input text to sound EXACTLY like the target voice.
        - Change the sentence structure to match the rhythm.
        - Swap words for the user's preferred diction.
        - Inject metaphors if appropriate for the density.
        
        OUTPUT:
        [The rewritten text only]`;

        const rewritten = await generateText(prompt);

        return NextResponse.json({ rewritten: rewritten.trim() });
    } catch (error) {
        console.error('Error rewriting text:', error);
        return NextResponse.json({ error: 'Failed to rewrite text' }, { status: 500 });
    }
}
