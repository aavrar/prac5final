import { NextResponse } from 'next/server';
import { UserTensor } from '@/lib/types';
import { generateText } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const tensor: UserTensor = await request.json();

        const prompt = `Based on this writer's current state, generate 5 conversation starter suggestions (questions or prompts they might want to explore with an AI writing assistant).

WRITER CONTEXT:
- Emotional State: ${tensor.emotional_landscape.current_state.dominant_emotion}
- Active Conflicts: ${tensor.emotional_landscape.active_conflicts.join(', ')}
- Recent themes: ${tensor.emotional_landscape.processed_themes.join(', ')}

Generate 5 short suggestions (5-8 words each) that feel relevant to their current state. Make them conversational, not generic.

Output ONLY valid JSON array of strings:
["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"]`;

        const response = await generateText(prompt);

        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('Invalid response format from AI');
        }

        const suggestions: string[] = JSON.parse(jsonMatch[0]);

        return NextResponse.json({ suggestions });
    } catch (error) {
        console.error('Error generating suggestions:', error);
        return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
    }
}
