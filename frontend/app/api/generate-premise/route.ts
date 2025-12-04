import { NextResponse } from 'next/server';
import { UserTensor, Premise } from '@/lib/types';
import { generateText } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const tensor: UserTensor = await request.json();

        const prompt = `You are part of a Dual-Network AI system for generating deeply personalized story premises.

UNIVERSAL NETWORK ANALYSIS:
Analyze this user's emotional state for universal narrative themes:
- Dominant Emotion: ${tensor.emotional_landscape.current_state.dominant_emotion}
- Active Conflicts: ${tensor.emotional_landscape.active_conflicts.join(', ')}
- Processed Themes: ${tensor.emotional_landscape.processed_themes.join(', ')}

Identify: What universal human experience is at the core? (e.g., "The burden of expectation", "The silence between generations", "Identity as performance")

CULTURAL SPECIFICITY NETWORK ANALYSIS:
Now analyze their specific cultural context:
- Heritage: ${tensor.cultural_coordinates.heritage.map(h => 'region' in h ? h.region : `${h.context} (Generation ${h.generation})`).join(', ')}
- Languages: ${tensor.cultural_coordinates.linguistics.primary}, ${tensor.cultural_coordinates.linguistics.secondary}, ${tensor.cultural_coordinates.linguistics.tertiary}
- Code-switching: ${tensor.cultural_coordinates.linguistics.code_switching_patterns.frequency} frequency
- Faith Framework: ${tensor.cultural_coordinates.faith_framework.tradition} (${tensor.cultural_coordinates.faith_framework.key_concepts.join(', ')})
- Intellectual Context: ${tensor.intellectual_frameworks.core_concepts.join(', ')}

Identify: What culturally-specific nuance complicates this universal theme? Consider:
- Diaspora anxieties
- Multilingual consciousness
- Faith and modernity tensions
- Cultural expectations vs. personal desires

BLENDING INTELLIGENCE:
Generate a story premise that weaves universal resonance with cultural specificity.

Output ONLY valid JSON in this exact format:
{
  "title": "A concise, evocative title that hints at both universal and cultural themes",
  "logline": "A 1-2 sentence premise that explicitly names the universal theme and the cultural complication",
  "context": "1 sentence explaining how this premise emerged from the user's current emotional state and conflicts",
  "stylistic_note": "Voice guidance based on: ${tensor.creative_voice.syntax_rhythm}, ${tensor.creative_voice.diction}, metaphors of ${tensor.creative_voice.recurring_motifs.join(', ')}"
}

Remember: Cultural specificity isn't decoration. Code-switching, diaspora consciousness, and faith frameworks fundamentally shape how universal themes manifest.`

        const response = await generateText(prompt);

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid response format from AI');
        }

        const premise: Premise = JSON.parse(jsonMatch[0]);

        return NextResponse.json(premise);
    } catch (error) {
        console.error('Error generating premise:', error);
        return NextResponse.json({ error: 'Failed to generate premise' }, { status: 500 });
    }
}
