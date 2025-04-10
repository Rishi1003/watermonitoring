import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/db';
import buoyData from '@/models/buoyData';

export async function POST(request) {
    try {
        const body = await request.json();

        await connectToDatabase()

        const resp = await buoyData.create(body)

        return NextResponse.json({ message: 'Created DB entry', data: resp });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "server error", error })
    }
}
