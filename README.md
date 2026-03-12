# BD-LMS: Advanced Learning Management System

A premium, full-stack learning management system tailored for the Bangladesh competitive exam market (BCS, Bank, Govt Jobs). Features a modern tech stack centered on Next.js 15, Prisma, and Clerk.

## 🚀 Speed Start

```bash
# 1. Clone & Install
git clone <repo-url>
npm install

# 2. Environment Setup
# Copy .env.example to .env.local and fill in your secrets
cp .env.example .env.local

# 3. Database Sync
npx prisma generate
npx prisma db push

# 4. Development
npm run dev
```

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components)
- **Auth**: Clerk (v6) with Metadata-based Role system
- **Database**: PostgreSQL with Prisma 5
- **Styling**: Tailwind CSS + Headless UI + Shaded UI
- **Editor**: Custom Tiptap v2 (KaTeX, Youtube, UploadThing)
- **Analytics**: Recharts for performance tracking
- **Deployment**: Optimized for Vercel/Railway

## 📂 Architecture Overview

- `src/app/(main)`: Public-facing content routes (MCQs, Exams, Blog, etc.)
- `src/app/(dashboard)`: Private student workspace and history.
- `src/app/(admin)`: Administrative control center.
- `src/lib`: Core utilities (API handlers, Auth helpers, Zod schemas).
- `prisma/schema.prisma`: The single source of truth for the platform's data models.

## 🔑 Key Features

- **Exam Hall**: Real-time timer-based exams with automatic grading.
- **Rich Content**: Tiptap editor with full math support using KaTeX.
- **Global Search**: Command palette (Cmd+K) for instant portal-wide discovery.
- **Analytics**: Detailed performance breakdowns for both students and admins.
- **Data Vault**: Centralized resource library for PDFs and study assets.

## 📄 License
Proprietary. Developed for BD-LMS Project.
