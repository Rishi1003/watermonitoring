'use client'

import React, { useEffect, useState } from 'react';
import { MapPin, Droplet, Thermometer, Gauge, Activity, Table } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

function App() {
  const [sensorData, setSensorData] = useState({
    turbidity: "Clear",
    ph: 0,
    tds: 0
  });

  const [chartData, setChartData] = useState([]);
  const [dataHistory, setDataHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.31.132');
        const data = await response.json();
        setSensorData(data);

        if (data.temperature) {
          setChartData(prevData => {
            const timestamp = data.timestamp || new Date().toISOString();

            // Parse the timestamp using regex to handle single-digit month/day/hours/minutes/seconds
            const parts = timestamp.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})Z$/);

            // Create a properly formatted timestamp with padded values
            const fixedTimestamp = parts ?
              `${parts[1]}-${parts[2].padStart(2, '0')}-${parts[3].padStart(2, '0')}T${parts[4].padStart(2, '0')}:${parts[5].padStart(2, '0')}:${parts[6].padStart(2, '0')}Z` :
              timestamp;

            // Parse the fixed timestamp into a Date object
            const dateObj = new Date(fixedTimestamp);

            // Format time for display
            const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


            const newData = [...prevData, {
              name: time,
              value: data.temperature
            }];
            return newData.length > 6 ? newData.slice(-6) : newData;
          });
        }

        setDataHistory(prev => {
          const newHistory = [...prev, data];
          return newHistory.slice(-5);
        });
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const position = [
    sensorData.latitude || 1.3521,
    sensorData.longitude || 103.8198
  ];

  // Extract just the status word from turbidity string
  const turbidityStatus = sensorData.turbidity.split(' ')[0];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Water Quality Dashboard</h1>

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
              Temperature & Humidity
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
              <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                  <Popup>
                    Water Quality Monitoring Station
                    <br />
                    Satellites: {sensorData.satellites || 'N/A'}
                    <br />
                    Speed: {sensorData.speed || 0} km/h
                  </Popup>
                </Marker>
                <MapUpdater position={position} />
              </MapContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Latitude</p>
                <p className="text-md font-semibold text-gray-800">{position[0].toFixed(6)}°</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Longitude</p>
                <p className="text-md font-semibold text-gray-800">{position[1].toFixed(6)}°</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data History Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Table className="text-indigo-500 mr-2" />
            Recent Measurements
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turbidity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">pH</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TDS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataHistory.map((reading, index) => {
                  const timestamp = reading.timestamp || new Date().toISOString();

                  // Parse the timestamp using regex to handle single-digit month/day/hours/minutes/seconds
                  const parts = timestamp.match(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2})Z$/);

                  // Create a properly formatted timestamp with padded values
                  const fixedTimestamp = parts ?
                    `${parts[1]}-${parts[2].padStart(2, '0')}-${parts[3].padStart(2, '0')}T${parts[4].padStart(2, '0')}:${parts[5].padStart(2, '0')}:${parts[6].padStart(2, '0')}Z` :
                    timestamp;

                  // Parse the fixed timestamp into a Date object
                  const dateObj = new Date(fixedTimestamp);

                  // Format time for display
                  const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


                  const readingStatus = reading.turbidity.split(' ')[0];

                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {readingStatus}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reading.ph}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reading.tds} ppm
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reading.temperature ? reading.temperature.toFixed(2) : 'N/A'} °C
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reading.humidity ? reading.humidity.toFixed(2) : 'N/A'}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reading.latitude && reading.longitude ?
                          `${reading.latitude.toFixed(6)}, ${reading.longitude.toFixed(6)}` :
                          'N/A'}
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

export default App;