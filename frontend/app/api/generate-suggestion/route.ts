import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { generateText } from '@/lib/gemini';
import { getUserTensor } from '@/lib/db/tensor';

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        const { userId, currentText, ambientContext } = requestBody;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const tensor = await getUserTensor(userId);
        const lastSentence = currentText.slice(-3000); // Increased context window to 3000 chars

        const prompt = `COMPLETE THE FOLLOWING TEXT.
        
        CONTEXT (The story so far):
        "...${lastSentence}"

        STYLE INSTRUCTIONS:
        - Syntax Rhythm: ${tensor.creative_voice?.syntax_rhythm || 'Standard'}
        - Diction: ${tensor.creative_voice?.diction || 'Neutral'}
        - Recurring Motifs: ${tensor.creative_voice?.recurring_motifs?.join(', ') || 'None'}
        - Primary Language: ${tensor.cultural_coordinates?.linguistics?.primary || 'English'}
        - Secondary Language: ${tensor.cultural_coordinates?.linguistics?.secondary || 'None'}
        - Code-Switching Pattern: ${JSON.stringify(tensor.cultural_coordinates?.linguistics?.code_switching_patterns || {})}
        - Current Emotional State: ${tensor.emotional_landscape?.current_state?.dominant_emotion || 'Neutral'} (Valence: ${tensor.emotional_landscape?.current_state?.valence || 'Neutral'})

        AMBIENT CONTEXT (User's Environment):
        - Time of Day: ${requestBody.ambientContext?.timeOfDay || 'Unknown'}
        - Local Time: ${requestBody.ambientContext?.localTime || 'Unknown'}

        TASK:
        Write the next sentence of the story. 
        
        CONSTRAINTS:
        1. **NO NEW CHARACTERS**: Use only the characters already present in the context. Do not invent names like "Professor Armitage".
        2. **NO META-COMMENTARY**: Just write the story.
        3. **Mimic the Voice**: Use the syntax rhythm and diction described above.
        4. **Ambient Influence**: If it is "Late Night", lean towards more introspective, dreamlike, or quiet syntax. If "Morning", be more crisp and alert.
        4. **Code-Switching**: If the emotional context matches the "Code-Switching Pattern" (e.g., high emotion -> Secondary Language), explicitly use a word or phrase in ${tensor.cultural_coordinates?.linguistics?.secondary || 'the secondary language'}. Wrap non-English words in italics.

        OUTPUT:
        [The next sentence only]`;

        const suggestion = await generateText(prompt);

        return NextResponse.json({ suggestion: suggestion.trim() });
    } catch (error) {
        console.error('Error generating suggestion:', error);
        return NextResponse.json({ error: 'Failed to generate suggestion' }, { status: 500 });
    }
}
