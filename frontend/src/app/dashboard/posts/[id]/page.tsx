"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/dashboard/posts");
        const json = await res.json();
        if (json.success) {
          const found = json.data.find((p: any) => p.post_id === id);
          setPost(found || null);
        } else setError(json.message || "Failed to load post");
      } catch (err: any) {
        setError(err.message || "Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!post) return <p className="text-gray-400">Post not found</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{post.title || "Post Details"}</h2>

      {post.localizations.map((loc: any, idx: number) => (
        <div
          key={idx}
          className="bg-stone-900 p-4 rounded-xl border border-gray-800"
        >
          <p className="text-gray-400 text-sm mb-2">
            {loc.language} / {loc.region}
          </p>
          {loc.images?.map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              alt={`Image ${i}`}
              className="w-full h-64 object-cover rounded-lg mb-2"
            />
          ))}
          <p className="text-white">{loc.caption}</p>
          {loc.hashtags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {loc.hashtags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-stone-800 text-blue-400 px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
