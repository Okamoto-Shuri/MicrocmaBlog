// src/app/api/blog/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getBlog, updateBlog, deleteBlog } from "@/lib/microcms";

// GET: 投稿詳細取得
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // ← params は Promise
) {
    try {
        const { id } = await context.params; // ← await が必要
        const blog = await getBlog(id);
        return NextResponse.json(blog);
    } catch (error: unknown) {
        console.error("GET /api/blog/[id] error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// PATCH: 投稿編集
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params; // ← await
        const body = await req.json();

        if (!body.title) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const updated = await updateBlog(id, body);
        return NextResponse.json(updated);
    } catch (error: unknown) {
        console.error("PATCH /api/blog/[id] error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// DELETE: 投稿削除
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params; // ← await
        await deleteBlog(id);
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error: unknown) {
        console.error("DELETE /api/blog/[id] error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
