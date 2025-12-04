export interface CulturalCoordinate {
  region: string;
  weight: number;
  nuance: string;
}

export interface DiasporaContext {
  context: string;
  generation: number;
  anxieties: string[];
}

export interface Linguistics {
  primary: string;
  secondary: string;
  tertiary: string;
  code_switching_patterns: {
    emotional_transition: string;
    intellectual_transition: string;
    frequency: string;
  };
}

export interface FaithFramework {
  tradition: string;
  practice_level: string;
  key_concepts: string[];
}

export interface IntellectualFramework {
  disciplines: string[];
  core_concepts: string[];
  fandoms: {
    domain: string;
    metaphor_utility: string;
  }[];
}

export interface CreativeVoice {
  syntax_rhythm: string;
  diction: string;
  metaphor_density: string;
  recurring_motifs: string[];
}

export interface EmotionalLandscape {
  current_state: {
    valence: string;
    arousal: string;
    dominant_emotion: string;
  };
  processed_themes: string[];
  active_conflicts: string[];
}

export interface ContextualSignals {
  local_time: string;
  heart_rate: number;
  device: string;
  recent_consumption: string[];
}

export interface UserTensor {
  user_id: string;
  timestamp: string;
  cultural_coordinates: {
    heritage: (CulturalCoordinate | DiasporaContext)[];
    linguistics: Linguistics;
    faith_framework: FaithFramework;
  };
  intellectual_frameworks: IntellectualFramework;
  creative_voice: CreativeVoice;
  emotional_landscape: EmotionalLandscape;
  contextual_signals: ContextualSignals;
}

export interface Premise {
  title: string;
  logline: string;
  context: string;
  stylistic_note: string;
}

export interface SceneResponse {
  scene: string;
  annotations: {
    type: 'cultural' | 'linguistic';
    note: string;
  }[];
}
