import { NextRequest, NextResponse } from 'next/server';
import { getUserTensor, updateUserTensor, initializeUserTensor } from '@/lib/db/tensor';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        // Ensure it exists, initialize if not
        const tensor = await initializeUserTensor(userId);
        return NextResponse.json(tensor);
    } catch (error) {
        console.error('Error fetching tensor:', error);
        return NextResponse.json({ error: 'Failed to fetch tensor' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { user_id, updates } = await request.json();

        if (!user_id || !updates) {
            return NextResponse.json({ error: 'User ID and updates are required' }, { status: 400 });
        }

        const updatedTensor = await updateUserTensor(user_id, updates);
        return NextResponse.json(updatedTensor);
    } catch (error) {
        console.error('Error updating tensor:', error);
        return NextResponse.json({ error: 'Failed to update tensor' }, { status: 500 });
    }
}
