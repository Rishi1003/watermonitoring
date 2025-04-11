// "use client";

// import { useEffect, useRef } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import L from 'leaflet';

// export function LakeCard({ name, address, latitude, longitude }) {
//   const mapRef = useRef(null);

//   useEffect(() => {
//     if (!mapRef.current) return;

//     const map = L.map(mapRef.current, {
//       center: [latitude, longitude],
//       zoom: 14,
//       dragging: false,
//       scrollWheelZoom: false,
//       touchZoom: false,
//       doubleClickZoom: false,
//       boxZoom: false,
//       keyboard: false,
//       zoomControl: false,
//     });

//     L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
//       maxZoom: 20,
//       subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
//     }).addTo(map);

//     return () => {
//       map.remove();
//     };
//   }, [latitude, longitude]);

//   return (
//     <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-blue-100/50 hover:border-blue-200/50 group">
//       <div className="relative h-48 w-full">
//         <div
//           ref={mapRef}
//           className="h-full w-full z-0"
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 group-hover:to-black/20 transition-opacity duration-300 z-10" />
//       </div>
//       <div className="relative z-20 bg-white p-4">
//         <CardHeader className="p-0 mb-2">
//           <CardTitle className="text-xl font-semibold text-sky-800">
//             {name}
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-0">
//           <p className="text-sm text-sky-700/80">{address}</p>
//         </CardContent>
//       </div>
//     </Card>
//   );
// }

"use client";

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import L from 'leaflet';

export function LakeCard({ name, address, latitude, longitude }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [latitude, longitude],
      zoom: 14,

      // 🔓 Enable interactions:
      dragging: true,
      scrollWheelZoom: true,
      touchZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      zoomControl: true, // shows the + / - control
    });

    L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-blue-100/50 hover:border-blue-200/50 group">
      <div className="relative h-48 w-full">
        <div
          ref={mapRef}
          className="h-full w-full z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 group-hover:to-black/20 transition-opacity duration-300 z-10 pointer-events-none" />
      </div>
      <div className="relative z-20 bg-white p-4">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-xl font-semibold text-sky-800">
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-sm text-sky-700/80">{address}</p>
        </CardContent>
      </div>
    </Card>
  );
}
