// src/app/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

type BlogItem = {
  id: string;
  title: string;
  body?: string;
  thumbnail?: { url: string } | null;
  publishedAt?: string;
};

// API 経由で記事一覧を取得
async function getBlogList(): Promise<BlogItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`, {
    cache: "no-store", // SSR で最新データ取得
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  const data = await res.json();
  return data.contents;
}

export default async function Page() {
  const blogs = await getBlogList();

  return (
    <main className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">ブログ一覧</h1>
        <Link href="/blog/new">
          <Button>新規投稿</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Card key={blog.id} className="hover:shadow-xl transition-shadow">
            {blog.thumbnail && (
              <Image
                src={blog.thumbnail.url}
                alt={blog.title}
                width={600}
                height={300} 
                className="rounded-t-2xl w-full h-48 object-cover"
              />
            )}
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {blog.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {blog.publishedAt
                  ? new Date(blog.publishedAt).toLocaleDateString("ja-JP")
                  : "未公開"}
              </p>
              <Link
                href={`/blog/${blog.id}`}
                className="inline-block mt-3 text-blue-500 hover:underline"
              >
                記事を読む →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
