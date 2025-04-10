import { LakeCard } from "@/components/lake-card";

const lakes = [
  {
    name: "Lake Louise",
    address: "Improvement District No. 9, AB, Canada",
    latitude: 12.712655,
    longitude: 77.445894,
  },
  {
    name: "Lake Como",
    address: "Lombardy, Italy",
    latitude: 45.9937,
    longitude: 9.2666,
  },
  {
    name: "Lake Tahoe",
    address: "California/Nevada, United States",
    latitude: 39.0968,
    longitude: -120.0324,
  },
  {
    name: "Lake Bled",
    address: "Bled, Slovenia",
    latitude: 46.3625,
    longitude: 14.0937,
  },
  {
    name: "Lake Wakatipu",
    address: "Otago, New Zealand",
    latitude: -45.0302,
    longitude: 168.6616,
  },
  {
    name: "Lake Baikal",
    address: "Siberia, Russia",
    latitude: 53.5587,
    longitude: 108.1649,
  },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent mb-2">
        Discover Beautiful Lakes
      </h1>
      <p className="text-center text-sky-700/80 mb-12 text-lg">
        Explore the world's most stunning lakes and their locations
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lakes.map((lake) => (
          <LakeCard
            key={lake.name}
            name={lake.name}
            address={lake.address}
            latitude={lake.latitude}
            longitude={lake.longitude}
          />
        ))}
      </div>
    </div>
  );
}