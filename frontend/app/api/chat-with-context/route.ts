import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { generateText } from '@/lib/gemini';
import { getUserTensor } from '@/lib/db/tensor';

export async function POST(request: Request) {
    try {
        const { userId, message, currentText, history } = await request.json();

        if (!userId || !message) {
            return NextResponse.json({ error: 'User ID and message are required' }, { status: 400 });
        }

        const tensor = await getUserTensor(userId);

        // Format history for context
        const historyContext = history?.map((msg: any) =>
            `${msg.role === 'user' ? 'USER' : 'AI'}: ${msg.parts[0].text}`
        ).join('\n') || '';

        const prompt = `You are a creative writing partner and editor.
        
        USER PROFILE:
        - Style: ${tensor.creative_voice?.syntax_rhythm || 'Standard'}
        - Tone: ${tensor.emotional_landscape?.current_state?.dominant_emotion || 'Neutral'}

        THE STORY SO FAR (Context):
        "${currentText?.slice(-2000) || 'No content yet.'}"

        CHAT HISTORY:
        ${historyContext}

        USER MESSAGE:
        "${message}"

        TASK:
        Reply to the user's message. 
        - If they ask about the story, answer based on the "THE STORY SO FAR".
        - If they ask for ideas, suggest things that fit the current context.
        - Be helpful, encouraging, and specific to the text provided.
        - Keep responses concise (under 3 sentences unless asked for more).

        REPLY:`;

        const reply = await generateText(prompt);

        return NextResponse.json({ reply: reply.trim() });
    } catch (error) {
        console.error('Error in chat-with-context:', error);
        return NextResponse.json({ error: 'Failed to generate reply' }, { status: 500 });
    }
}
