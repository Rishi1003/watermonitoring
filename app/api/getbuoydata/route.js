import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/db';
import buoyData from '@/models/buoyData';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        console.log("Query ID:", id);

        if (!id) {
            return NextResponse.json({ message: "Missing 'id' parameter" }, { status: 400 });
        }

        await connectToDatabase();

        // Make sure to trim and compare string exactly
        const resp = await buoyData.find({ id: id.trim() });

        return NextResponse.json({ message: 'Buoy data fetched successfully', data: resp });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
}

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
