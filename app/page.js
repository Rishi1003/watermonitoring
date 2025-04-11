import { LakeCard } from "@/components/lake-card";
import axios from "axios";
import Link from "next/link";

export const dynamic = 'force-dynamic'; // enables SSR


export default async function Home() {

  const res = await axios.get("http://localhost:3000/api/createbuoy")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent mb-2">
        Discover Beautiful Lakes
      </h1>
      <p className="text-center text-sky-700/80 mb-12 text-lg">
        Explore the world's most stunning lakes and their locations
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {res.data.data.map((lake) => (
          <Link href={"/lake/" + lake._id}><LakeCard
            key={lake.lakeName}
            name={lake.lakeName}
            address={lake.address}
            latitude={lake.latitude}
            longitude={lake.longitude}
          /></Link>
        ))}
      </div>
    </div>
  );
}