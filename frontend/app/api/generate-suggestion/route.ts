import { NextResponse } from 'next/server';
import { UserTensor } from '@/lib/types';
import { generateText } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const { tensor, currentText }: { tensor: UserTensor; currentText: string } = await request.json();

        const lastSentence = currentText.slice(-200);

        const prompt = `You are providing a brief writing suggestion for a user mid-composition.

CURRENT TEXT (last portion):
"${lastSentence}"

USER VOICE PROFILE:
- Syntax: ${tensor.creative_voice.syntax_rhythm}
- Diction: ${tensor.creative_voice.diction}
- Recurring Motifs: ${tensor.creative_voice.recurring_motifs.join(', ')}
- Languages: ${tensor.cultural_coordinates.linguistics.primary}, ${tensor.cultural_coordinates.linguistics.secondary}
- Emotional State: ${tensor.emotional_landscape.current_state.dominant_emotion}

Generate a single sentence (15-25 words) that could naturally follow their current text. Match their voice exactly. If appropriate for emotional precision, include a ${tensor.cultural_coordinates.linguistics.secondary} word in italics.

Output ONLY the suggestion sentence, nothing else.`;

        const suggestion = await generateText(prompt);

        return NextResponse.json({ suggestion: suggestion.trim() });
    } catch (error) {
        console.error('Error generating suggestion:', error);
        return NextResponse.json({ error: 'Failed to generate suggestion' }, { status: 500 });
    }
}
