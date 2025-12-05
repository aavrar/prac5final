import { getDatabase } from '@/lib/mongodb';
import { UserTensor } from '@/lib/types';
import { MOCK_USER_TENSOR } from '@/lib/mockData';

const COLLECTION_NAME = 'user_tensors';

export async function getUserTensor(userId: string): Promise<UserTensor> {
    const db = await getDatabase();
    const tensor = await db.collection(COLLECTION_NAME).findOne({ user_id: userId });

    if (!tensor) {
        // If no tensor exists, return the mock one (and maybe save it?)
        // For now, let's return the mock one but with the correct user_id
        return { ...MOCK_USER_TENSOR, user_id: userId };
    }

    return tensor as unknown as UserTensor;
}

export async function updateUserTensor(userId: string, updates: Partial<UserTensor>): Promise<UserTensor> {
    const db = await getDatabase();

    // We need to be careful with nested updates. 
    // For simplicity in this prototype, we might want to merge in the application layer 
    // or use dot notation for specific fields if we were doing granular updates.
    // But since we might be updating whole sections (e.g. 'emotional_landscape'), 
    // let's fetch, merge, and replace for now to ensure type safety and simplicity.

    const currentTensor = await getUserTensor(userId);
    const newTensor = { ...currentTensor, ...updates, timestamp: new Date().toISOString() };

    // Remove _id if it exists in the object to avoid immutable field error
    const { _id, ...tensorToSave } = newTensor as any;

    await db.collection(COLLECTION_NAME).updateOne(
        { user_id: userId },
        { $set: tensorToSave },
        { upsert: true }
    );

    return newTensor;
}

export async function initializeUserTensor(userId: string): Promise<UserTensor> {
    const db = await getDatabase();
    const existing = await db.collection(COLLECTION_NAME).findOne({ user_id: userId });

    if (existing) {
        return existing as unknown as UserTensor;
    }

    const initialTensor = { ...MOCK_USER_TENSOR, user_id: userId, timestamp: new Date().toISOString() };
    await db.collection(COLLECTION_NAME).insertOne(initialTensor);
    return initialTensor;
}
