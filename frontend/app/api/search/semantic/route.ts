import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getDatabase } from '@/lib/mongodb';
import { generateEmbedding, cosineSimilarity } from '@/lib/db/vector';

export async function POST(request: Request) {
    try {
        const { userId, query, limit = 5 } = await request.json();

        if (!userId || !query) {
            return NextResponse.json({ error: 'User ID and query are required' }, { status: 400 });
        }

        // 1. Generate embedding for the query
        const queryEmbedding = await generateEmbedding(query);
        if (!queryEmbedding || queryEmbedding.length === 0) {
            return NextResponse.json({ error: 'Failed to generate query embedding' }, { status: 500 });
        }

        const db = await getDatabase();

        // 2. Fetch all stories for the user that have embeddings
        // Note: In production, use a vector DB index. For prototype, in-memory scan is fine.
        const stories = await db.collection('stories')
            .find({ user_id: userId, embedding: { $exists: true } })
            .project({ title: 1, content: 1, embedding: 1, created_at: 1 })
            .toArray();

        // 3. Calculate similarity and sort
        const results = stories.map(story => {
            const similarity = cosineSimilarity(queryEmbedding, story.embedding);
            return {
                ...story,
                similarity,
                // Don't send the full embedding back to client
                embedding: undefined
            };
        })
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);

        return NextResponse.json({ results });
    } catch (error) {
        console.error('Error in semantic search:', error);
        return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
    }
}
