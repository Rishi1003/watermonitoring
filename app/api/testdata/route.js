// import { connectToDatabase } from '@/lib/db';
// import BuoyData from '@/models/buoyData';

// const parseDuration = (duration) => {
//     const match = duration.match(/(?:(\d+)w)?(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?/);
//     if (!match) return null;
//     const [, weeks, days, hours, minutes] = match.map(Number);
//     return (
//         (weeks || 0) * 10080 +
//         (days || 0) * 1440 +
//         (hours || 0) * 60 +
//         (minutes || 0)
//     );
// };

// const getGroupFormat = (totalMinutes) => {
//     if (totalMinutes >= 10080) return '%Y-%m-%d'; // 1w+
//     if (totalMinutes >= 1440) return '%Y-%m-%dT%H:00:00'; // 1d+
//     return '%Y-%m-%dT%H:%M:00'; // <=1d
// };

// const extractNumber = (field) => ({
//     $convert: {
//         input: {
//             $ifNull: [
//                 {
//                     $getField: {
//                         input: {
//                             $regexFind: {
//                                 input: { $toString: `$${field}` },
//                                 regex: /\d+(\.\d+)?/,
//                             },
//                         },
//                         field: 'match',
//                     },
//                 },
//                 null,
//             ],
//         },
//         to: 'double',
//         onError: null,
//         onNull: null,
//     },
// });

// export async function GET(req) {
//     try {
//         await connectToDatabase();

//         const { searchParams } = new URL(req.url);
//         const duration = searchParams.get('duration');
//         const fromParam = searchParams.get('from');
//         const toParam = searchParams.get('to');

//         let fromDate, toDate;
//         let totalMinutes;

//         if (duration) {
//             totalMinutes = parseDuration(duration);
//             if (!totalMinutes || totalMinutes <= 0) {
//                 return new Response(JSON.stringify({ error: 'Invalid duration format' }), {
//                     status: 400,
//                 });
//             }
//             toDate = new Date();
//             fromDate = new Date(toDate.getTime() - totalMinutes * 60 * 1000);
//         } else if (fromParam && toParam) {
//             fromDate = new Date(fromParam);
//             toDate = new Date(toParam);
//             if (isNaN(fromDate) || isNaN(toDate)) {
//                 return new Response(JSON.stringify({ error: 'Invalid date format' }), {
//                     status: 400,
//                 });
//             }
//             totalMinutes = Math.ceil((toDate - fromDate) / (60 * 1000));
//         } else {
//             return new Response(JSON.stringify({ error: 'Missing duration or from/to parameters' }), {
//                 status: 400,
//             });
//         }

//         const groupFormat = getGroupFormat(totalMinutes);

//         const data = await BuoyData.aggregate([
//             {
//                 $addFields: {
//                     ts: {
//                         $convert: {
//                             input: '$timestamp',
//                             to: 'date',
//                             onError: null,
//                             onNull: null,
//                         },
//                     },
//                 },
//             },
//             {
//                 $match: {
//                     ts: {
//                         $ne: null,
//                         ...(fromDate && { $gte: fromDate }),
//                         ...(toDate && { $lte: toDate }),
//                     },
//                 },
//             },
//             {
//                 $group: {
//                     _id: {
//                         $dateToString: {
//                             format: groupFormat,
//                             date: '$ts',
//                         },
//                     },
//                     avgTurbidity: { $avg: extractNumber('turbidity') },
//                     avgPh: { $avg: extractNumber('ph') },
//                     avgTds: { $avg: extractNumber('tds') },
//                     avgTemperature: { $avg: extractNumber('temperature') },
//                     avgHumidity: { $avg: extractNumber('humidity') },
//                     avgLatitude: { $avg: extractNumber('latitude') },
//                     avgLongitude: { $avg: extractNumber('longitude') },
//                     avgSpeed: { $avg: extractNumber('speed') },
//                     avgAltitude: { $avg: extractNumber('altitude') },
//                     avgSatellites: { $avg: extractNumber('satellites') },
//                     count: { $sum: 1 },
//                 },
//             },
//             {
//                 $sort: { _id: 1 },
//             },
//         ]);

//         return new Response(JSON.stringify(data), {
//             status: 200,
//             headers: { 'Content-Type': 'application/json' },
//         });
//     } catch (err) {
//         console.error('[API ERROR]', err);
//         return new Response(JSON.stringify({ error: 'Server error' }), {
//             status: 500,
//         });
//     }
// }


import { connectToDatabase } from '@/lib/db';
import BuoyData from '@/models/buoyData';

const parseDuration = (duration) => {
    const match = duration.match(/(?:(\d+)w)?(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?/);
    if (!match) return null;
    const [, weeks, days, hours, minutes] = match.map(Number);
    return (
        (weeks || 0) * 10080 +
        (days || 0) * 1440 +
        (hours || 0) * 60 +
        (minutes || 0)
    );
};

const getGroupFormat = (totalMinutes) => {
    if (totalMinutes >= 10080) return '%Y-%m-%d';
    if (totalMinutes >= 1440) return '%Y-%m-%dT%H:00:00';
    return '%Y-%m-%dT%H:%M:00';
};

const extractNumber = (field) => ({
    $convert: {
        input: {
            $ifNull: [
                {
                    $getField: {
                        input: {
                            $regexFind: {
                                input: { $toString: `$${field}` },
                                regex: /\d+(\.\d+)?/,
                            },
                        },
                        field: 'match',
                    },
                },
                null,
            ],
        },
        to: 'double',
        onError: null,
        onNull: null,
    },
});

export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const duration = searchParams.get('duration');
        const fromParam = searchParams.get('from');
        const toParam = searchParams.get('to');
        const idParam = searchParams.get('id'); // 👈 new addition

        let fromDate, toDate;
        let totalMinutes;

        if (duration) {
            totalMinutes = parseDuration(duration);
            if (!totalMinutes || totalMinutes <= 0) {
                return new Response(JSON.stringify({ error: 'Invalid duration format' }), {
                    status: 400,
                });
            }
            toDate = new Date();
            fromDate = new Date(toDate.getTime() - totalMinutes * 60 * 1000);
        } else if (fromParam && toParam) {
            fromDate = new Date(fromParam);
            toDate = new Date(toParam);
            if (isNaN(fromDate) || isNaN(toDate)) {
                return new Response(JSON.stringify({ error: 'Invalid date format' }), {
                    status: 400,
                });
            }
            totalMinutes = Math.ceil((toDate - fromDate) / (60 * 1000));
        } else {
            return new Response(JSON.stringify({ error: 'Missing duration or from/to parameters' }), {
                status: 400,
            });
        }

        const groupFormat = getGroupFormat(totalMinutes);

        const data = await BuoyData.aggregate([
            {
                $addFields: {
                    ts: {
                        $convert: {
                            input: '$timestamp',
                            to: 'date',
                            onError: null,
                            onNull: null,
                        },
                    },
                },
            },
            {
                $match: {
                    ts: {
                        $ne: null,
                        ...(fromDate && { $gte: fromDate }),
                        ...(toDate && { $lte: toDate }),
                    },
                    ...(idParam && { id: idParam }), // 👈 this filters by device ID
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: groupFormat,
                            date: '$ts',
                        },
                    },
                    avgTurbidity: { $avg: extractNumber('turbidity') },
                    avgPh: { $avg: extractNumber('ph') },
                    avgTds: { $avg: extractNumber('tds') },
                    avgTemperature: { $avg: extractNumber('temperature') },
                    avgHumidity: { $avg: extractNumber('humidity') },
                    avgLatitude: { $avg: extractNumber('latitude') },
                    avgLongitude: { $avg: extractNumber('longitude') },
                    avgSpeed: { $avg: extractNumber('speed') },
                    avgAltitude: { $avg: extractNumber('altitude') },
                    avgSatellites: { $avg: extractNumber('satellites') },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('[API ERROR]', err);
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
        });
    }
}
