// src/lib/microcms.ts (修正版)
const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN || "blog-with-micro";
const BASE_URL = `https://${SERVICE_DOMAIN}.microcms.io/api/v1`;

// 型定義
export type MicroCMSImage = {
    url: string;
    height?: number;
    width?: number;
};

export type BlogItem = {
    id: string;
    title: string;
    body?: string;
    thumbnail?: MicroCMSImage | null;
    publishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
};

type ListResponse<T> = {
    contents: T[];
    totalCount?: number;
    offset?: number;
    limit?: number;
};

// APIキー取得ユーティリティ（呼び出し時にチェック）
function getApiKey(): string {
    const key = process.env.MICROCMS_API_KEY;
    if (!key) {
        // 実行時にわかりやすく例外を投げる（トップレベルでは投げない）
        throw new Error(
        "MICROCMS_API_KEY is not set. Add MICROCMS_API_KEY to your environment variables."
        );
    }
    return key;
}

async function microcmsRequest<T>(
    path: string,
    init: Omit<RequestInit, "body"> & { body?: unknown } = {}
): Promise<T> {
    const url = `${BASE_URL}${path}`;

    const headers: Record<string, string> = {
        "X-API-KEY": getApiKey(), // ここでようやくキーを参照
        ...(init.headers as Record<string, string> ?? {}),
    };

    let body: BodyInit | undefined;
    if (init.body !== undefined) {
        if (init.body instanceof FormData) {
        body = init.body;
        } else if (typeof init.body === "object") {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(init.body);
        } else if (typeof init.body === "string") {
        body = init.body;
        }
    }

    const options: RequestInit = {
        ...init,
        headers,
        body,
    };

    const res = await fetch(url, options);

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`microCMS request failed: ${res.status} ${res.statusText} - ${text}`);
    }

    // DELETE は多くの microCMS 設定で本文を返さないため、method が DELETE の場合は undefined を返す
    if ((init.method ?? "GET").toUpperCase() === "DELETE") {
        return undefined as T;
    }

    return (await res.json()) as T;
}

// API メソッド
export async function getBlogs(
    queries?: Record<string, string | number | boolean>
): Promise<ListResponse<BlogItem>> {
    const qs = queries
        ? `?${new URLSearchParams(
            Object.entries(queries).map(([k, v]) => [k, String(v)])
        ).toString()}`
        : "";
    return microcmsRequest<ListResponse<BlogItem>>(`/blog${qs}`);
}

export async function getBlog(id: string): Promise<BlogItem> {
    return microcmsRequest<BlogItem>(`/blog/${encodeURIComponent(id)}`);
}

export async function createBlog(data: Partial<BlogItem>): Promise<BlogItem> {
    return microcmsRequest<BlogItem>(`/blog`, {
        method: "POST",
        body: data,
    });
}

export async function updateBlog(id: string, data: Partial<BlogItem>): Promise<BlogItem> {
    return microcmsRequest<BlogItem>(`/blog/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: data,
    });
}

export async function deleteBlog(id: string): Promise<void> {
    return microcmsRequest<void>(`/blog/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
}

const microcmsClient = {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
};
export default microcmsClient;
