"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdDetails from "@/components/Adsdetails";

export default function AdDetailPage() {
  const { add_id } = useParams();
  const router = useRouter();
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!add_id) return;

    const fetchAd = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/ads");
        if (!res.ok) throw new Error("Failed to fetch ads");

        const data = await res.json();
        const found = data.ads.find((a: any) => a.ad_id === add_id);
        setAd(found || null);
      } catch (err) {
        console.error(err);
        setAd(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [add_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading ad details...
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <p className="mb-4">Ad not found.</p>
        <button
          onClick={() => router.push("/dashboard/ads")}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
        >
          Back to Ads
        </button>
      </div>
    );
  }

  return <AdDetails ad={ad} onBack={() => router.push("/dashboard/ads")} />;
}
