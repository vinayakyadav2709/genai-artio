"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Calendar, Hash } from "lucide-react";

type Post = {
  post_id: string;
  caption: string;
  platforms: string[];
  status: string;
  scheduled_time: string;
  stats: {
    impressions: number;
    likes: number;
    shares: number;
    comments: number;
  };
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card
          key={post.post_id}
          onClick={() => router.push(`/dashboard/posts/${post.post_id}`)}
          className="cursor-pointer hover:shadow-lg transition rounded-2xl bg-white dark:bg-neutral-900"
        >
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">{post.caption}</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.scheduled_time).toLocaleString()}
            </div>

            <div className="flex gap-2 mt-3">
              {post.platforms.map((p) => (
                <span
                  key={p}
                  className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded-full"
                >
                  {p}
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 text-xs">Impressions</p>
                <p className="font-bold">{post.stats.impressions}</p>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 text-xs">Likes</p>
                <p className="font-bold">{post.stats.likes}</p>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 text-xs">Shares</p>
                <p className="font-bold">{post.stats.shares}</p>
              </div>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 text-xs">Comments</p>
                <p className="font-bold">{post.stats.comments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
