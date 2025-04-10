import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import buoy from '@/models/buoy';

export async function POST(request) {
    try {
        const body = await request.json();
        const { departmentName, lakes } = body;

        if (!departmentName || !Array.isArray(lakes)) {
            return NextResponse.json({ message: "Invalid data format" }, { status: 400 });
        }

        await connectToDatabase();

        const buoyData = lakes.map(lake => ({
            departmentName,
            lakeName: lake.name,
            latitude: lake.latitude,
            longitude: lake.longitude,
            address: lake.address
        }));

        const createdBuoys = await buoy.insertMany(buoyData);

        return NextResponse.json({ message: 'Created DB entries', data: createdBuoys });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
}
