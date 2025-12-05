import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');

        if (!userId) {
            return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const stories = await db.collection('stories')
            .find({ user_id: userId })
            .sort({ created_at: -1 })
            .toArray();

        return NextResponse.json({ stories });
    } catch (error) {
        console.error('Error loading stories:', error);
        return NextResponse.json({ error: 'Failed to load stories' }, { status: 500 });
    }
}

import { generateEmbedding } from '@/lib/db/vector';

// ... (imports)

export async function POST(request: NextRequest) {
    try {
        const { user_id, title, content, premise, scene, type } = await request.json();

        if (!user_id || !title) {
            return NextResponse.json({ error: 'user_id and title are required' }, { status: 400 });
        }

        const db = await getDatabase();

        // Generate embedding for content
        let embedding: number[] = [];
        if (content && content.length > 50) {
            embedding = await generateEmbedding(content);
        }

        const story = {
            user_id,
            title,
            content: content || '',
            embedding, // Store embedding
            premise: premise || null,
            scene: scene || null,
            type: type || 'draft',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const result = await db.collection('stories').insertOne(story);

        return NextResponse.json({
            success: true,
            story_id: result.insertedId,
            message: 'Story saved successfully'
        });
    } catch (error) {
        console.error('Error saving story:', error);
        return NextResponse.json({ error: 'Failed to save story' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { story_id, content, title, updated_at } = await request.json();

        if (!story_id) {
            return NextResponse.json({ error: 'story_id is required' }, { status: 400 });
        }

        const db = await getDatabase();

        const updateFields: any = {
            updated_at: new Date().toISOString()
        };

        if (content !== undefined) {
            updateFields.content = content;
            // Regenerate embedding if content changed significantly
            if (content.length > 50) {
                updateFields.embedding = await generateEmbedding(content);
            }
        }
        if (title !== undefined) updateFields.title = title;

        const result = await db.collection('stories').updateOne(
            { _id: new ObjectId(story_id) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Story updated successfully'
        });
    } catch (error) {
        console.error('Error updating story:', error);
        return NextResponse.json({ error: 'Failed to update story' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const storyId = searchParams.get('story_id');

        if (!storyId) {
            return NextResponse.json({ error: 'story_id is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const result = await db.collection('stories').deleteOne({ _id: new ObjectId(storyId) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Story deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting story:', error);
        return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
    }
}
