"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PostsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/dashboard/posts");
        const json = await res.json();
        if (json.success) setData(json.data || []);
        else setError(json.message || "Failed to load posts");
      } catch (err: any) {
        setError(err.message || "Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Posts</h2>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        {data.map((post: any) =>
          post.localizations.map((loc: any, idx: number) => (
            <div
              key={`${post.post_id}-${idx}`}
              onClick={() => router.push(`/posts/${post.post_id}`)}
              className="bg-stone-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-transform duration-300"
            >
              <div className="absolute mt-4 ml-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                {loc.language} / {loc.region}
              </div>
              {loc.images?.[0] && (
                <img
                  src={loc.images[0]}
                  alt="Post Image"
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <p className="text-white font-medium line-clamp-2">
                  {loc.caption || "No Caption"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
