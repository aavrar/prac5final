import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { UserTensor, Premise, SceneResponse } from '@/lib/types';
import { generateText } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const { tensor, premise }: { tensor: UserTensor; premise: Premise } = await request.json();

        const primaryHeritage = (tensor.cultural_coordinates.heritage[0] as any).region ||
                               (tensor.cultural_coordinates.heritage[0] as any).context;

        const prompt = `You are generating a scene that demonstrates Quantum Storytelling - where cultural specificity and universal narrative blend seamlessly.

PREMISE TO EXPAND:
Title: ${premise.title}
Logline: ${premise.logline}

USER CONTEXT:
Heritage: ${primaryHeritage}
Primary Language: ${tensor.cultural_coordinates.linguistics.primary}
Secondary Language: ${tensor.cultural_coordinates.linguistics.secondary}
Code-Switching Pattern: ${tensor.cultural_coordinates.linguistics.code_switching_patterns.emotional_transition}
Code-Switching Frequency: ${tensor.cultural_coordinates.linguistics.code_switching_patterns.frequency}
Creative Voice: ${tensor.creative_voice.syntax_rhythm}, ${tensor.creative_voice.diction}
Recurring Motifs: ${tensor.creative_voice.recurring_motifs.join(', ')}
Current Time: ${tensor.contextual_signals.local_time}
Emotional State: ${tensor.emotional_landscape.current_state.dominant_emotion}

GENERATION INSTRUCTIONS:

1. UNIVERSAL SCAFFOLD: Write a scene (2-3 paragraphs) that captures the emotional core of the premise. Use concrete imagery, internal conflict, and a sense of moment.

2. CULTURAL INJECTIONS: Weave in specific details:
   - Sensory details tied to ${primaryHeritage} (smells, sounds, textures specific to this place)
   - Family terms in ${tensor.cultural_coordinates.linguistics.secondary} (e.g., "Abbu" not "Dad")
   - ${tensor.creative_voice.recurring_motifs[0]} as a recurring motif

3. CODE-SWITCHING: Since frequency is ${tensor.cultural_coordinates.linguistics.code_switching_patterns.frequency}:
   ${tensor.cultural_coordinates.linguistics.code_switching_patterns.frequency === 'High'
     ? `- Include at least one instance where a word/phrase in ${tensor.cultural_coordinates.linguistics.secondary} appears because English cannot capture the nuance. Format: italicized word followed by em-dash and English approximation if needed.`
     : '- Use code-switching sparingly, only for emotional precision.'}

4. VOICE MATCHING: Write in a style that is: ${tensor.creative_voice.syntax_rhythm}, ${tensor.creative_voice.diction}

Output ONLY valid JSON in this exact format:
{
  "scene": "The complete scene text (2-3 paragraphs), with any ${tensor.cultural_coordinates.linguistics.secondary} words in italics using *asterisks*",
  "annotations": [
    {"type": "cultural", "note": "Explain what cultural details you injected and why"},
    {"type": "linguistic", "note": "Explain any code-switching choices and what they accomplish"}
  ]
}

Write a scene that feels both intimately specific to this cultural context AND universally resonant.`

        const response = await generateText(prompt);

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid response format from AI');
        }

        const sceneData: SceneResponse = JSON.parse(jsonMatch[0]);

        return NextResponse.json(sceneData);
    } catch (error) {
        console.error('Error generating scene:', error);
        return NextResponse.json({ error: 'Failed to generate scene' }, { status: 500 });
    }
}
