# Notebook 📓

A personal digital book reader for handwritten notes. Photograph your handwritten pages, organize them into books, and read them on the go in a clean, distraction-free interface.

## Features

- **Library View** — Organize notes into color-coded books on a visual bookshelf
- **Upload Flow** — Multi-file upload with camera capture support on mobile
- **Drag-to-Reorder** — Rearrange pages via drag-and-drop
- **Reader Mode** — Full-screen, distraction-free reading with:
  - Swipe / arrow key / tap navigation
  - Pinch-to-zoom & double-tap zoom for small handwriting
  - Light / Sepia / Dark reading themes
  - Auto-hiding UI chrome
  - Bottom filmstrip for quick page jumping
  - Next/previous image preloading

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** with custom editorial design system
- **Prisma ORM** + PostgreSQL
- **Vercel Blob** for image storage
- **Framer Motion** for animations
- **jose** for JWT session auth

## Getting Started

```bash
# Install dependencies
npm install

# Copy env template and fill in values
cp .env.example .env

# Push database schema
npx prisma db push

# Run dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `APP_PASSWORD` | Single password to access the app |
| `DATABASE_URL` | PostgreSQL connection string |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token |

## Deploy

Deploy to Vercel with one click — set the three environment variables in your Vercel project settings.
