// 'use client'

// import React, { useEffect, useState } from 'react';
// import { MapPin, Droplet, Thermometer, Gauge, Activity, Table } from 'lucide-react';
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import { useParams } from 'next/navigation';

// // Fix for default marker icon in react-leaflet
// delete (L.Icon.Default.prototype)._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//     iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// function MapUpdater({ position }) {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(position, map.getZoom());
//     }, [position, map]);
//     return null;
// }

// function LakeData() {
//     const params = useParams();
//     const id = params?.id;
//     const [loading, setLoading] = useState(true);
//     const [sensorData, setSensorData] = useState({
//         turbidity: "Clear",
//         ph: 0,
//         tds: 0
//     });
//     const [chartData, setChartData] = useState([]);
//     const [dataHistory, setDataHistory] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const response = await fetch(`http://localhost:3000/api/getbuoydata?id=${id}&limit=20`);
//                 const json = await response.json();
//                 const dataArr = json.data || [];

//                 if (dataArr.length === 0) {
//                     setLoading(false);
//                     return;
//                 }

//                 // Get the most recent reading for current values
//                 const latestReading = dataArr[0];
//                 setSensorData(latestReading);

//                 // Process all readings for chart data
//                 const formattedChartData = dataArr.map(reading => {
//                     const timestamp = formatTimestamp(reading.timestamp);
//                     const dateObj = new Date(timestamp);
//                     const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//                     return {
//                         name: time,
//                         value: reading.temperature
//                     };
//                 }).reverse(); // Reverse to show earliest to latest

//                 setChartData(formattedChartData);
//                 setDataHistory(dataArr.reverse()); // Reverse to show earliest to latest
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching sensor data:', error);
//                 setLoading(false);
//             }
//         };

//         fetchData();
//         // No interval needed anymore
//     }, [id]);

//     // Helper function to format timestamps consistently
//     const formatTimestamp = (timestamp) => {
//         if (!timestamp) return new Date().toISOString();

//         // Parse the timestamp using regex to handle single-digit values
//         const parts = timestamp.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})Z$/);

//         // Create a properly formatted timestamp with padded values
//         return parts ?
//             `${parts[1]}-${parts[2].padStart(2, '0')}-${parts[3].padStart(2, '0')}T${parts[4].padStart(2, '0')}:${parts[5].padStart(2, '0')}:${parts[6].padStart(2, '0')}Z` :
//             timestamp;
//     };

//     const position = [
//         sensorData.latitude || 1.3521,
//         sensorData.longitude || 103.8198
//     ];

//     // Extract just the status word from turbidity string
//     const turbidityStatus = sensorData.turbidity?.split(' ')[0] || 'Clear';

//     // Determine turbidity display properties
//     let turbidityColor, turbidityBgColor;
//     switch (turbidityStatus.toLowerCase()) {
//         case 'clear':
//             turbidityColor = 'text-green-500';
//             turbidityBgColor = 'bg-green-500';
//             break;
//         case 'cloudy':
//             turbidityColor = 'text-yellow-500';
//             turbidityBgColor = 'bg-yellow-500';
//             break;
//         case 'dirty':
//             turbidityColor = 'text-red-500';
//             turbidityBgColor = 'bg-red-500';
//             break;
//         default:
//             turbidityColor = 'text-gray-500';
//             turbidityBgColor = 'bg-gray-500';
//     }

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                     <p className="mt-4 text-gray-700">Loading water quality data...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
//             <div className="container mx-auto px-4 py-8">
//                 <h1 className="text-3xl font-bold text-gray-800 mb-8">Water Quality Dashboard</h1>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//                     {/* Turbidity Card */}
//                     <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center">
//                                 <Droplet className="text-blue-500 mr-2" />
//                                 <h3 className="text-lg font-semibold text-gray-700">Turbidity</h3>
//                             </div>
//                             <span className={`${turbidityColor} font-bold`}>
//                                 {turbidityStatus}
//                             </span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                             <div
//                                 className={`${turbidityBgColor} h-2.5 rounded-full`}
//                                 style={{
//                                     width: turbidityStatus === 'Clear' ? '33%' :
//                                         turbidityStatus === 'Cloudy' ? '66%' : '100%'
//                                 }}
//                             ></div>
//                         </div>
//                         <p className="mt-2 text-sm text-gray-500">
//                             Status: {turbidityStatus}
//                         </p>
//                     </div>

//                     {/* pH Value Card */}
//                     <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center">
//                                 <Activity className="text-purple-500 mr-2" />
//                                 <h3 className="text-lg font-semibold text-gray-700">pH Value</h3>
//                             </div>
//                             <span className={`font-bold ${sensorData.ph < 6 ? 'text-red-500' : 'text-green-500'}`}>
//                                 {sensorData.ph}
//                             </span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                             <div
//                                 className={`h-2.5 rounded-full ${sensorData.ph < 6 ? 'bg-red-500' : 'bg-green-500'}`}
//                                 style={{ width: `${(sensorData.ph / 14) * 100}%` }}
//                             ></div>
//                         </div>
//                         <p className="mt-2 text-sm text-gray-500">
//                             Status: {sensorData.ph < 6 ? 'Acidic' : sensorData.ph > 8 ? 'Alkaline' : 'Neutral'}
//                         </p>
//                     </div>

//                     {/* TDS Card */}
//                     <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center">
//                                 <Gauge className="text-green-500 mr-2" />
//                                 <h3 className="text-lg font-semibold text-gray-700">TDS</h3>
//                             </div>
//                             <span className="text-yellow-500 font-bold">{sensorData.tds} ppm</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                             <div
//                                 className="bg-yellow-500 h-2.5 rounded-full"
//                                 style={{ width: `${Math.min((sensorData.tds / 1000) * 100, 100)}%` }}
//                             ></div>
//                         </div>
//                         <p className="mt-2 text-sm text-gray-500">
//                             Status: {sensorData.tds === 0 ? 'No dissolved solids detected' : 'Solids detected'}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                     {/* Temperature & Humidity Chart */}
//                     <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                             <Thermometer className="text-orange-500 mr-2" />
//                             Temperature Trend
//                         </h3>
//                         <div className="h-64">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <AreaChart data={chartData}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="name" />
//                                     <YAxis />
//                                     <Tooltip />
//                                     <Area type="monotone" dataKey="value" stroke="#f97316" fill="#fdba74" />
//                                 </AreaChart>
//                             </ResponsiveContainer>
//                         </div>
//                         <div className="mt-4 grid grid-cols-2 gap-4">
//                             <div className="text-center">
//                                 <p className="text-sm text-gray-500">Temperature</p>
//                                 <p className="text-xl font-bold text-orange-500">
//                                     {sensorData.temperature ? sensorData.temperature.toFixed(2) : 'N/A'} °C
//                                 </p>
//                             </div>
//                             <div className="text-center">
//                                 <p className="text-sm text-gray-500">Humidity</p>
//                                 <p className="text-xl font-bold text-blue-500">
//                                     {sensorData.humidity ? sensorData.humidity.toFixed(2) : 'N/A'}%
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Location Map */}
//                     <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
//                         <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                             <MapPin className="text-red-500 mr-2" />
//                             Location
//                         </h3>
//                         <div className="h-64 rounded-lg overflow-hidden">
//                             <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
//                                 <TileLayer
//                                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                                     attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                                 />
//                                 <Marker position={position}>
//                                     <Popup>
//                                         Water Quality Monitoring Station
//                                         <br />
//                                         Satellites: {sensorData.satellites || 'N/A'}
//                                         <br />
//                                         Speed: {sensorData.speed || 0} km/h
//                                     </Popup>
//                                 </Marker>
//                                 <MapUpdater position={position} />
//                             </MapContainer>
//                         </div>
//                         <div className="mt-4 grid grid-cols-2 gap-4">
//                             <div className="text-center">
//                                 <p className="text-sm text-gray-500">Latitude</p>
//                                 <p className="text-md font-semibold text-gray-800">{position[0].toFixed(6)}°</p>
//                             </div>
//                             <div className="text-center">
//                                 <p className="text-sm text-gray-500">Longitude</p>
//                                 <p className="text-md font-semibold text-gray-800">{position[1].toFixed(6)}°</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Data History Table */}
//                 <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 mb-8">
//                     <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                         <Table className="text-indigo-500 mr-2" />
//                         Historical Measurements
//                     </h3>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turbidity</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">pH</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TDS</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {dataHistory.map((reading, index) => {
//                                     const timestamp = formatTimestamp(reading.timestamp);
//                                     const dateObj = new Date(timestamp);
//                                     const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//                                     const date = dateObj.toLocaleDateString();
//                                     const dateTime = `${date} ${time}`;
//                                     const readingStatus = reading.turbidity?.split(' ')[0] || 'Unknown';

//                                     return (
//                                         <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {dateTime}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {readingStatus}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {reading.ph}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {reading.tds} ppm
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {reading.temperature ? reading.temperature.toFixed(2) : 'N/A'} °C
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {reading.humidity ? reading.humidity.toFixed(2) : 'N/A'}%
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {reading.latitude && reading.longitude ?
//                                                     `${reading.latitude.toFixed(6)}, ${reading.longitude.toFixed(6)}` :
//                                                     'N/A'}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default LakeData;

'use client'

import React, { useEffect, useState } from 'react';
import { MapPin, Droplet, Thermometer, Gauge, Activity, Table } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Button } from "@/components/ui/button"; // or replace with a simple button class if you're not using shadcn
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useParams } from 'next/navigation';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ position }) {
    const map = useMap();
    useEffect(() => {
        map.setView(position, map.getZoom());
    }, [position, map]);
    return null;
}

function LakeData() {
    const params = useParams();
    const id = params?.id;
    const [loading, setLoading] = useState(true);
    const [duration, setDuration] = useState("1h"); // default duration
    const [sensorData, setSensorData] = useState({
        turbidity: "Clear",
        ph: 0,
        tds: 0
    });
    const [chartData, setChartData] = useState([]);
    const [dataHistory, setDataHistory] = useState([]);
    const [mapPosition, setMapPosition] = useState([1.3521, 103.8198]);

    const [durationTemp, setDurationTemp] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3000/api/testdata?duration=${duration}&id=${id}`);
                const dataArr = await response.json(); // directly get array

                if (response.status != 200) {
                    setDuration("1h")
                    setDurationTemp("")
                }

                if (!dataArr || dataArr.length === 0) {
                    setSensorData({});
                    setChartData([]);
                    setDataHistory([]);
                    setLoading(false);
                    return;
                }

                // Use the last item (most recent) for cards
                const latestReading = dataArr[dataArr.length - 1];

                setSensorData({
                    turbidity: `${latestReading.avgTurbidity.toFixed(1)} NTU`,
                    ph: Math.round(latestReading.avgPh),
                    tds: latestReading.avgTds,
                    temperature: latestReading.avgTemperature,
                    humidity: latestReading.avgHumidity,
                    speed: latestReading.avgSpeed,
                    satellites: latestReading.avgSatellites
                });

                // Use any valid lat/lng for map positioning
                setMapPosition([
                    latestReading.avgLatitude || 1.3521,
                    latestReading.avgLongitude || 103.8198
                ]);

                // Format chart data
                const formattedChartData = dataArr.map(entry => {
                    const date = new Date(entry._id + 'Z'); // force UTC interpretation
                    return {
                        name: date.toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                            timeZone: 'Asia/Kolkata'
                        }),
                        value: entry.avgTemperature
                    };
                });

                setChartData(formattedChartData);
                setDataHistory(dataArr.reverse()); // show latest on top
                setLoading(false);
            } catch (error) {
                console.error('Error fetching average data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, duration]); // Refetch data when duration changes

    // Helper function to format timestamps consistently
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return null;

        // Parse the timestamp using regex to handle single-digit values
        const parts = timestamp.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})Z$/);

        // Create a properly formatted timestamp with padded values
        return parts ?
            `${parts[1]}-${parts[2].padStart(2, '0')}-${parts[3].padStart(2, '0')}T${parts[4].padStart(2, '0')}:${parts[5].padStart(2, '0')}:${parts[6].padStart(2, '0')}Z` :
            timestamp;
    };

    // Check if a date is valid and format it
    const formatDateTime = (timestamp) => {
        if (!timestamp) return 'N/A';

        const formattedTimestamp = formatTimestamp(timestamp);
        if (!formattedTimestamp) return 'N/A';

        const dateObj = new Date(formattedTimestamp);

        // Check if date is valid
        if (isNaN(dateObj.getTime())) return 'N/A';

        const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const date = dateObj.toLocaleDateString();
        return `${date} ${time}`;
    };

    // Extract just the status word from turbidity string
    const turbidityStatus = (() => {
        const turbidityValue = parseFloat(sensorData.turbidity);
        if (turbidityValue < 55) return 'Clear';
        if (turbidityValue < 70) return 'Cloudy';
        return 'Dirty';
    })();

    // Determine turbidity display properties
    let turbidityColor, turbidityBgColor;
    switch (turbidityStatus.toLowerCase()) {
        case 'clear':
            turbidityColor = 'text-green-500';
            turbidityBgColor = 'bg-green-500';
            break;
        case 'cloudy':
            turbidityColor = 'text-yellow-500';
            turbidityBgColor = 'bg-yellow-500';
            break;
        case 'dirty':
            turbidityColor = 'text-red-500';
            turbidityBgColor = 'bg-red-500';
            break;
        default:
            turbidityColor = 'text-gray-500';
            turbidityBgColor = 'bg-gray-500';
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-700">Loading water quality data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Water Quality Dashboard</h1>

                <div className="mb-6 flex flex-wrap gap-4 items-center">
                    {["1w", "1d", "1h", "10m"].map((dur) => (
                        <Button
                            key={dur}
                            className={`px-2 py-2 text-white w-12 ${duration === dur ? "bg-blue-700" : "bg-blue-400"}`}
                            onClick={() => setDuration(dur)}
                        >
                            {dur.toUpperCase()}
                        </Button>
                    ))}
                    <input
                        type="text"
                        placeholder="Custom (e.g. 3h)"
                        value={durationTemp}
                        onChange={(e) => setDurationTemp(e.target.value)}
                        className="px-2 py-2 border text-black border-blue-300 rounded-md shadow-sm focus:outline-none placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                        className="bg-blue-600 text-white px-4 py-2"
                        onClick={() => { setDuration(durationTemp); }}
                    >
                        Fetch
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Turbidity Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <Droplet className="text-blue-500 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-700">Turbidity</h3>
                            </div>
                            <span className={`${turbidityColor} font-bold`}>
                                {turbidityStatus}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className={`${turbidityBgColor} h-2.5 rounded-full`}
                                style={{
                                    width: turbidityStatus === 'Clear' ? '33%' :
                                        turbidityStatus === 'Cloudy' ? '66%' : '100%'
                                }}
                            ></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Status: {turbidityStatus}
                        </p>
                    </div>

                    {/* pH Value Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <Activity className="text-purple-500 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-700">pH Value</h3>
                            </div>
                            <span className={`font-bold ${sensorData.ph < 6 ? 'text-red-500' : 'text-green-500'}`}>
                                {sensorData.ph}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${sensorData.ph < 6 ? 'bg-red-500' : 'bg-green-500'}`}
                                style={{ width: `${(sensorData.ph / 14) * 100}%` }}
                            ></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Status: {sensorData.ph < 6 ? 'Acidic' : sensorData.ph > 8 ? 'Alkaline' : 'Neutral'}
                        </p>
                    </div>

                    {/* TDS Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <Gauge className="text-green-500 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-700">TDS</h3>
                            </div>
                            <span className="text-yellow-500 font-bold">{sensorData.tds} ppm</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-yellow-500 h-2.5 rounded-full"
                                style={{ width: `${Math.min((sensorData.tds / 1000) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Status: {sensorData.tds === 0 ? 'No dissolved solids detected' : 'Solids detected'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Temperature & Humidity Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <Thermometer className="text-orange-500 mr-2" />
                            Temperature Trend
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="value" stroke="#f97316" fill="#fdba74" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Temperature</p>
                                <p className="text-xl font-bold text-orange-500">
                                    {sensorData.temperature ? sensorData.temperature.toFixed(2) : 'N/A'} °C
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Humidity</p>
                                <p className="text-xl font-bold text-blue-500">
                                    {sensorData.humidity ? sensorData.humidity.toFixed(2) : 'N/A'}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Location Map */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <MapPin className="text-red-500 mr-2" />
                            Location
                        </h3>
                        <div className="h-64 rounded-lg overflow-hidden">
                            <MapContainer center={mapPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker position={mapPosition}>
                                    <Popup>
                                        Water Quality Monitoring Station
                                        <br />
                                        Satellites: {Math.round(sensorData.satellites) || 'N/A'}
                                        <br />
                                        Speed: {Math.round(sensorData.speed) || 0} km/h
                                    </Popup>
                                </Marker>
                                <MapUpdater position={mapPosition} />
                            </MapContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Latitude</p>
                                <p className="text-md font-semibold text-gray-800">{mapPosition[0].toFixed(6)}°</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Longitude</p>
                                <p className="text-md font-semibold text-gray-800">{mapPosition[1].toFixed(6)}°</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data History Table */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <Table className="text-indigo-500 mr-2" />
                        Historical Measurements
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Turbidity</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">pH</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">TDS</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dataHistory.map((reading, index) => {
                                    const dateTime = (() =>
                                        new Date(reading._id + 'Z').toLocaleString('en-IN', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                            timeZone: 'Asia/Kolkata',
                                            timeZoneName: 'short'
                                        })
                                    )();

                                    const readingStatus = (() => {
                                        const turbidityValue = parseFloat(sensorData.turbidity);
                                        if (turbidityValue < 55) return 'Clear';
                                        if (turbidityValue < 70) return 'Cloudy';
                                        return 'Dirty';
                                    })();

                                    // Check if GPS coordinates are valid
                                    const hasValidCoordinates = reading.latitude && !isNaN(reading.latitude) &&
                                        reading.longitude && !isNaN(reading.longitude);
                                    const locationDisplay = hasValidCoordinates ?
                                        `${reading.latitude.toFixed(6)}, ${reading.longitude.toFixed(6)}` :
                                        'N/A';

                                    return (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800">
                                                {dateTime}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800">
                                                {readingStatus}
                                            </td>
                                            <td className='text-gray-800 text-center'>{Math.round(reading.avgPh)}</td>
                                            <td className='text-gray-800 text-center'>{reading.avgTds} ppm</td>
                                            <td className='text-gray-800 text-center'>{reading.avgTemperature?.toFixed(2)} °C</td>
                                            <td className='text-gray-800 text-center'>{reading.avgHumidity?.toFixed(2)}%</td>
                                            <td className='text-gray-800 text-center'>
                                                {reading.avgLatitude && reading.avgLongitude
                                                    ? `${reading.avgLatitude.toFixed(6)}, ${reading.avgLongitude.toFixed(6)}`
                                                    : 'N/A'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LakeData;