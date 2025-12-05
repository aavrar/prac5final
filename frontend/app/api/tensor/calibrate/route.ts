import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/gemini';
import { getUserTensor, updateUserTensor } from '@/lib/db/tensor';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { userId, message, history } = await request.json();

        if (!userId || !message) {
            return NextResponse.json({ error: 'User ID and message are required' }, { status: 400 });
        }

        // Fetch current tensor to give context to the AI
        const currentTensor = await getUserTensor(userId);

        // Construct prompt for Gemini
        const systemPrompt = `
        You are the "Calibration Engine" for a Quantum Storytelling system. 
        Your goal is to interview the user to build a deep psychological and creative profile (the "User Tensor").
        
        CURRENT TENSOR STATE:
        ${JSON.stringify(currentTensor, null, 2)}

        USER MESSAGE: "${message}"

        INSTRUCTIONS:
        1. Analyze the user's message for any new information about:
           - Cultural Background (Heritage, Languages, Faith)
           - Intellectual Interests (Disciplines, Fandoms)
           - Creative Voice (Style, Motifs)
           - Emotional Landscape (Current feelings, Conflicts)
        
        2. If you find new information, create a JSON object with the updates.
           - Be specific. If they say "I'm sad", update emotional_landscape.current_state.valence to "Melancholic".
           - If they mention "Star Wars", add it to intellectual_frameworks.fandoms.

        3. Generate a natural, empathetic reply to continue the interview. 
           - Acknowledge what they said.
           - Ask a follow-up question to dig deeper into a missing or shallow part of the Tensor.
        
        OUTPUT FORMAT:
        Return a JSON object ONLY:
        {
            "reply": "Your conversational reply here...",
            "updates": { ...partial tensor updates... } (or null if no updates)
        }
        `;

        const jsonString = await generateText(systemPrompt);
        const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();

        let result;
        try {
            result = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse calibration response", e);
            // Fallback
            return NextResponse.json({
                reply: "I see. Could you tell me more about that?",
                tensorUpdated: false
            });
        }

        let tensorUpdated = false;
        if (result.updates && Object.keys(result.updates).length > 0) {
            await updateUserTensor(userId, result.updates);
            tensorUpdated = true;
        }

        return NextResponse.json({
            reply: result.reply,
            tensorUpdated
        });

    } catch (error) {
        console.error('Calibration error:', error);
        return NextResponse.json({ error: 'Failed to process calibration' }, { status: 500 });
    }
}
