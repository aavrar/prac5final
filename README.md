# Quantum Storytelling

A deeply personalized AI writing companion that generates culturally-grounded narratives using a dual-network architecture.

## Concept

Quantum Storytelling demonstrates a theoretical framework where AI doesn't just generate stories—it understands the writer as a complete being. Cultural context, linguistic patterns, emotional landscape, and creative voice are treated as inseparable dimensions of identity that fundamentally shape narrative generation.

### The Dual-Network Architecture

**Universal Network**: Analyzes user state for universal human themes (grief, ambition, identity, belonging)

**Cultural Specificity Network**: Analyzes heritage, language, faith, and diaspora context for culturally-specific nuances

**Blending Intelligence**: Weaves both together to create stories that are both universally resonant AND intimately specific

## Key Features

### 1. User Tensor System
A multi-dimensional representation of writer identity including:
- Cultural Coordinates (heritage, linguistics, faith)
- Intellectual Frameworks (disciplines, concepts, influences)
- Creative Voice (syntax rhythm, diction, recurring motifs)
- Emotional Landscape (current state, processed themes, active conflicts)
- Contextual Signals (time, device, recent consumption)

### 2. Real AI Generation
- **Premise Generation**: Creates story ideas based on emotional state and cultural context
- **Scene Expansion**: Generates 2-3 paragraph scenes with cultural injections and code-switching
- **Ghost Text Suggestions**: Real-time writing assistance that matches user voice
- **Personalized Prompts**: Daily writing prompts tailored to user's themes

### 3. Cultural Specificity in Action
- Code-switching between languages (e.g., English/Urdu)
- Family terms in native language ("Abbu" not "Dad")
- Sensory details tied to specific heritage contexts
- Faith framework concepts woven into narrative
- Diaspora consciousness and anxieties

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5
- **AI**: Google Gemini API (gemini-pro)
- **UI**: Tailwind CSS 4 + shadcn/ui components

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key (free tier available at https://makersuite.google.com/app/apikey)

### Installation Steps

1. Navigate to the project:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env.local file with your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > .env.local
```

4. Run development server:
```bash
npm run dev
```

5. Open browser:
```
http://localhost:3001
```

## Usage

### Demo Flow

**1. Home Page** (`/`)
- Personalized time-based greeting
- Contextual prompt based on emotional state
- AI-generated writing prompt
- Quick actions to conversation, editor, or archive

**2. Conversation** (`/conversation`)
- Type any message about writing ideas
- AI generates culturally-aware premise using your tensor
- Shows title, logline, context, and stylistic notes

**3. Editor** (`/editor`)
- Write freely in the text area
- After 50+ characters, pause for 3 seconds
- Ghost text suggestion appears at bottom
- Accept (✓) or reject (✗) suggestions

**4. Your Tensor** (`/profile`)
- View complete user profile breakdown
- 6 dimensional cards showing your identity

**5. Archive** (`/archive`)
- Constellation visualization of story network

## Theoretical Foundation

### Why "Quantum" Storytelling?

The name references quantum superposition: a writer exists simultaneously as:
- A specific, culturally-situated individual
- A universal human experiencing archetypal emotions

The system never collapses these states into one or the other—it holds both truths.

### Cultural Specificity ≠ Decoration

Key insight: Code-switching, diaspora consciousness, and faith frameworks aren't aesthetic flourishes added to universal templates. They **fundamentally shape how universal themes manifest**.

Example:
- **Universal**: Grief between generations
- **Cultural Nuance**: That grief complicated by immigration sacrifice narratives, code-switching between languages of emotion, "log kya kahenge" (what will people say)

## Course Demo Script

### Setup (Before Presenting)
1. Ensure dev server is running on localhost:3001
2. Have multiple browser tabs open (Home, Conversation, Editor, Profile)

### Presentation Flow

**1. Introduction (2 min)**
"This is Quantum Storytelling - not generic AI writing, but culturally-grounded narrative generation based on a theoretical dual-network architecture."

**2. The Tensor Concept (3 min)**
- Open `/profile` tab
- "This is the user tensor - identity as multi-dimensional, not flat tags"
- Point out: Cultural coordinates, creative voice, emotional landscape

**3. Live Demo: Premise Generation (4 min)**
- Open `/conversation`
- Type: "I want to write about family expectations"
- Point out universal theme + cultural complication

**4. Live Demo: Ghost Text (3 min)**
- Open `/editor`
- Start typing a story opening
- Pause after 50+ characters
- Show accept/reject functionality

## Troubleshooting

**AI not responding:**
- Check `.env.local` has correct GEMINI_API_KEY
- Check browser console for errors
- Verify Gemini API quota hasn't been exceeded

**"undefined" showing in conversation:**
- Check server logs in terminal
- Ensure Gemini is returning valid JSON

**Ghost text not appearing:**
- Write at least 50 characters
- Wait full 3 seconds without typing

## License

Course project for "AI and the Future of Writing".
