# Blog with microCMS

ブログ投稿アプリケーション。Next.js（App Router）＋TypeScript、microCMS を使って、投稿の一覧表示・詳細表示・新規投稿・編集・削除の一連の機能を備えています。UI は shadcn/ui、画像最適化に `next/image` を利用。

---

## 概要

| 内容 | 説明 |
|---|---|
| **目的** | ブログ記事の CRUD 操作を簡単にできるサンプルアプリ。Next.js App Router を使ったモダンな構成。 |
| **ターゲットユーザー** | Next.js + TypeScript を学びたい人、簡易的にブログ開発を経験したい人。 |
| **特徴** | 投稿の一覧 ⇨ 詳細 ⇨ 新規作成／編集／削除が可能。画像対応、UIがモダン、環境変数で安全な API キー管理。 |

---

## 主な機能

-**投稿一覧ページ**：サムネイル画像付きカード形式で一覧表示  
-**詳細ページ**：タイトル・公開日・本文表示＋編集・削除・戻る操作  
-**新規投稿**：タイトル・本文入力 → 投稿  
-**編集**：既存記事を読み込み → タイトル・本文を編集  
-**削除**：詳細ページにモーダル確認付きの削除ボタンを設置  
-**画像対応**：rich text 内の HTML／サムネイルの画像を `next/image` で最適化表示  

---

## 技術スタック

| 項目 | 技術 |
|---|---|
| フレームワーク | Next.js（App Router） |
| 言語 | TypeScript |
| UI ライブラリ | shadcn/ui |
| API バックエンド | microCMS REST API |
| 画像最適化 | `next/image` と `remotePatterns` 設定 |
| 環境変数 | `.env.local`（API キー、公開 URL 等） |
| コンポーネント構造 | サーバーコンポーネント＋クライアントコンポーネントの混在 |

---

## セットアップ

.env.local ファイルを作成し、以下を追加

MICROCMS_API_KEY=あなたのmicroCMSのAPIキー
MICROCMS_SERVICE_DOMAIN=blog-with-micro  # 必要に応じて変更
NEXT_PUBLIC_BASE_URL=http://localhost:3000

---

## セットアップ

src/
├── app/
│   ├── api/
│   │   ├── blog/
│   │   │   └── route.ts           # 投稿一覧取得／新規作成
│   │   └── [id]/
│   │       └── route.ts           # 投稿詳細取得／編集／削除
│   ├── blog/
│   │   ├── new/
│   │   │   └── page.tsx           # 新規投稿ページ（クライアントコンポーネント）
│   │   ├── [id]/
│   │   │   ├── page.tsx           # 詳細ページ（サーバーコンポーネント）
│   │   │   └── edit/
│   │   │       └── page.tsx       # 編集ページ（クライアントコンポーネント）
│   └── page.tsx                   # 投稿一覧ページ
├── components/
│   ├── ui/                        # shadcn/ui コンポーネント群
│   └── DeleteButton.tsx            # 削除ボタンモーダルコンポーネント
└── lib/
    └── microcms.ts                 # microCMS 通信共通処理

.env.local
next.config.js
package.json