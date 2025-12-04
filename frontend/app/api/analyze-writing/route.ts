import { NextResponse } from 'next/server';
import { UserTensor } from '@/lib/types';
import { generateText } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const { tensor, content, type }: { tensor: UserTensor; content: string; type: 'feedback' | 'suggestions' | 'outline' } = await request.json();

        let prompt = ''

        if (type === 'feedback') {
            prompt = `You are a writing coach providing feedback on this piece.

USER'S WRITING:
"${content}"

USER'S VOICE PROFILE:
- Syntax: ${tensor.creative_voice.syntax_rhythm}
- Diction: ${tensor.creative_voice.diction}
- Recurring Motifs: ${tensor.creative_voice.recurring_motifs.join(', ')}
- Cultural Context: ${(tensor.cultural_coordinates.heritage[0] as any).region || 'N/A'}

Provide constructive feedback focusing on:
1. How well they're maintaining their unique voice
2. Moments where cultural specificity could be deepened
3. Opportunities to weave in their recurring motifs
4. Overall strengths and 1-2 specific suggestions for improvement

Keep feedback encouraging and specific. 2-3 paragraphs maximum.`
        } else if (type === 'suggestions') {
            prompt = `Based on this writing, suggest 3 specific next steps or directions.

CURRENT WRITING:
"${content}"

USER CONTEXT:
- Emotional themes: ${tensor.emotional_landscape.processed_themes.join(', ')}
- Active conflicts: ${tensor.emotional_landscape.active_conflicts.join(', ')}
- Recurring motifs: ${tensor.creative_voice.recurring_motifs.join(', ')}

Generate 3 concrete suggestions for how to develop this piece. Each should be 1-2 sentences.

Output as JSON array:
["Suggestion 1", "Suggestion 2", "Suggestion 3"]`
        } else {
            // outline
            prompt = `Generate a brief outline of this writing piece, identifying key structural elements.

WRITING:
"${content}"

Analyze and provide:
1. Opening hook/setup (1 sentence)
2. Core tension/conflict (1 sentence)
3. Key moments/beats (2-3 bullet points)
4. Emotional arc (1 sentence)

Format as clear, concise outline. Maximum 150 words.`
        }

        const response = await generateText(prompt)

        if (type === 'suggestions') {
            const jsonMatch = response.match(/\[[\s\S]*\]/)
            if (jsonMatch) {
                const suggestions = JSON.parse(jsonMatch[0])
                return NextResponse.json({ suggestions })
            }
        }

        return NextResponse.json({ result: response })
    } catch (error) {
        console.error('Error analyzing writing:', error)
        return NextResponse.json({ error: 'Failed to analyze writing' }, { status: 500 })
    }
}
