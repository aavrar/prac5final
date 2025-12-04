import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { UserTensor } from '@/lib/types';
import { generateText } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const tensor: UserTensor = await request.json();

        const prompt = `Based on this writer's profile, generate a single evocative writing prompt that would resonate with them.

WRITER PROFILE:
- Emotional State: ${tensor.emotional_landscape.current_state.dominant_emotion}
- Active Conflicts: ${tensor.emotional_landscape.active_conflicts.join(', ')}
- Processed Themes: ${tensor.emotional_landscape.processed_themes.join(', ')}
- Recurring Motifs: ${tensor.creative_voice.recurring_motifs.join(', ')}
- Cultural Context: ${(tensor.cultural_coordinates.heritage[0] as any).region || (tensor.cultural_coordinates.heritage[0] as any).context}

Generate a single writing prompt (1-2 sentences) that:
1. Connects to their emotional landscape
2. Incorporates one of their recurring motifs
3. Has cultural specificity

Output ONLY the prompt text, nothing else.`;

        const promptText = await generateText(prompt);

        return NextResponse.json({ prompt: promptText.trim() });
    } catch (error) {
        console.error('Error generating prompt:', error);
        return NextResponse.json({ error: 'Failed to generate prompt' }, { status: 500 });
    }
}
