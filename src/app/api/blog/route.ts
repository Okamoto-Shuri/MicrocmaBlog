// src/app/api/blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getBlogs, createBlog } from "@/lib/microcms";

// GET: 投稿一覧取得
export async function GET() {
    try {
        const blogs = await getBlogs();
        return NextResponse.json(blogs);
    } catch (error: unknown) {
        console.error("GET /api/blog error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// POST: 新規投稿作成
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
    
        if (!body.title || !body.body) {
            return NextResponse.json(
            { error: "Title and content are required" },
            { status: 400 }
            );
        }
    
        const created = await createBlog(body);
        return NextResponse.json(created);
        } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}