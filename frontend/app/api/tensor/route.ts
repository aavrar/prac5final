import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { UserTensor } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');

        if (!userId) {
            return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
        }

        const db = await getDatabase();
        const tensor = await db.collection('tensors').findOne({ user_id: userId });

        if (!tensor) {
            return NextResponse.json({ error: 'Tensor not found' }, { status: 404 });
        }

        return NextResponse.json({ tensor });
    } catch (error) {
        console.error('Error loading tensor:', error);
        return NextResponse.json({ error: 'Failed to load tensor' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const tensor: UserTensor = await request.json();

        if (!tensor.user_id) {
            return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
        }

        const db = await getDatabase();

        const result = await db.collection('tensors').updateOne(
            { user_id: tensor.user_id },
            {
                $set: {
                    ...tensor,
                    timestamp: new Date().toISOString()
                }
            },
            { upsert: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Tensor saved successfully',
            upserted: result.upsertedCount > 0
        });
    } catch (error) {
        console.error('Error saving tensor:', error);
        return NextResponse.json({ error: 'Failed to save tensor' }, { status: 500 });
    }
}
