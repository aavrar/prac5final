import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const db = await getDatabase();

        const collections = await db.listCollections().toArray();

        const stats = await db.stats();

        return NextResponse.json({
            success: true,
            message: 'MongoDB connection successful!',
            database: db.databaseName,
            collections: collections.map(c => c.name),
            stats: {
                collections: stats.collections,
                dataSize: stats.dataSize,
                indexes: stats.indexes
            }
        });
    } catch (error: any) {
        console.error('MongoDB connection error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            details: error.toString()
        }, { status: 500 });
    }
}
