"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostDetails, { Post } from "@/components/PostDetails";

export default function PostDetailPage() {
  const { post_id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!post_id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        const found = (data.posts as Post[]).find((p) => p.post_id === post_id);
        setPost(found || null);
      } catch (err) {
        console.error(err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [post_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading post details...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <p className="mb-4">Post not found.</p>
        <button
          onClick={() => router.push("/dashboard/posts")}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
        >
          Back to Posts
        </button>
      </div>
    );
  }

  return (
    <PostDetails post={post} onBack={() => router.push("/dashboard/posts")} />
  );
}
