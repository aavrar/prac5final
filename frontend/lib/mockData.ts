import { UserTensor } from './types';

const DEFAULT_TENSOR: UserTensor = {
    user_id: "user_123_quantum",
    timestamp: new Date().toISOString(),
    cultural_coordinates: {
        heritage: [
            {
                region: "Sindh, Pakistan",
                weight: 0.9,
                nuance: "Specific regional context distinct from Punjab"
            },
            {
                context: "USA",
                generation: 1.5,
                anxieties: ["Visa status", "Assimilation vs. Preservation"]
            }
        ],
        linguistics: {
            primary: "English (US)",
            secondary: "Urdu",
            tertiary: "Sindhi",
            code_switching_patterns: {
                emotional_transition: "Urdu for grief/intimacy",
                intellectual_transition: "English for analysis/abstraction",
                frequency: "High"
            }
        },
        faith_framework: {
            tradition: "Islam",
            practice_level: "Personal/Internalized",
            key_concepts: ["Sabr (Patience)", "Niyat (Intention)"]
        }
    },
    intellectual_frameworks: {
        disciplines: ["Computational Sociolinguistics", "Creative Writing"],
        core_concepts: [
            "Linguistic Sovereignty",
            "Code-switching as feature",
            "Identity as performance"
        ],
        fandoms: [
            {
                domain: "Professional Wrestling",
                metaphor_utility: "Kayfabe as a lens for reality"
            }
        ]
    },
    creative_voice: {
        syntax_rhythm: "Controlled, rhythmic, frequent use of caesura",
        diction: "Elevated but grounded",
        metaphor_density: "High",
        recurring_motifs: ["Mirrors", "Airports", "Silence", "The Body"]
    },
    emotional_landscape: {
        current_state: {
            valence: "Contemplative",
            arousal: "Low-Medium",
            dominant_emotion: "Yearning/Ambition"
        },
        processed_themes: ["Grief", "Displacement"],
        active_conflicts: ["PhD Application Stress", "Artistic Validation"]
    },
    contextual_signals: {
        local_time: "02:00",
        heart_rate: 70,
        device: "Mobile",
        recent_consumption: ["Ayad Akhtar", "Fatima Farheen Mirza"]
    }
};

export function getUserTensor(): UserTensor {
    if (typeof window === 'undefined') {
        return DEFAULT_TENSOR;
    }

    try {
        const stored = localStorage.getItem('user_tensor');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading tensor from localStorage:', error);
    }

    return DEFAULT_TENSOR;
}

export async function loadUserTensorFromDB(userId: string): Promise<UserTensor | null> {
    try {
        const response = await fetch(`/api/tensor?user_id=${userId}`);
        if (response.ok) {
            const data = await response.json();
            return data.tensor;
        }
    } catch (error) {
        console.error('Error loading tensor from MongoDB:', error);
    }
    return null;
}

export const MOCK_USER_TENSOR = getUserTensor();
