// src/app/blog/[id]/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import DeleteButton from "@/components/DeleteButton"; // ← パス変更

type BlogItem = {
  id: string;
  title: string;
  body?: string;
  thumbnail?: { url: string } | null;
  publishedAt?: string;
};

// 単一記事を API 経由で取得
async function getBlogDetail(id: string): Promise<BlogItem> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blog");
  }

  return res.json();
}

// ページコンポーネント
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlogDetail(id);

  return (
    <main className="p-8">
      <Card className="max-w-3xl mx-auto">
        {blog.thumbnail && (
          <Image
            src={blog.thumbnail.url}
            alt={blog.title}
            width={600}
            height={300}
            className="rounded-t-2xl w-full h-64 object-cover"
          />
        )}
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{blog.title}</CardTitle>
          <p className="text-sm text-gray-500">
            {blog.publishedAt
              ? new Date(blog.publishedAt).toLocaleDateString("ja-JP")
              : "未公開"}
          </p>
        </CardHeader>
        <CardContent>
          {blog.body ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.body }}
            />
          ) : (
            <p className="text-gray-600">本文がありません。</p>
          )}

          <div className="mt-6 flex space-x-4">
            <Link href={`/blog/${blog.id}/edit`}>
              <Button variant="outline">編集</Button>
            </Link>
            <DeleteButton id={blog.id} resource="blog" /> {/* 修正済み */}
            <Link href="/">
              <Button>一覧に戻る</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

