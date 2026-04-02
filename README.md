# SyncDraft 🚀

A Real-time Collaborative Text Editor built for seamless multi-user
document editing.

🌐 **Live Demo:** https://sync-draft-virid.vercel.app/\
📂 **GitHub Repo:** https://github.com/uv05709/SyncDraft

------------------------------------------------------------------------

## 📌 Problem Statement

Build a real-time collaborative text editor where multiple users can
edit the same document simultaneously with instant synchronization,
presence tracking, and conflict handling.

------------------------------------------------------------------------

## ✨ Features

### Core Features

-   📝 Real-time multi-user editing
-   ⚡ Instant synchronization across users
-   👥 Presence indicators (active users)
-   🔤 Rich text formatting (Bold, Italic, Underline)
-   📄 Create and manage documents
-   🔗 Shareable document links

### Additional Features

-   💾 Document persistence using MongoDB
-   🧾 Editable document titles
-   📊 Recent documents dashboard
-   🎨 Clean and responsive UI
-   ⚙️ Full CRUD support (Create, Read, Update, Delete)

------------------------------------------------------------------------

## 🏗️ Architecture Overview

Client (Next.js + Lexical Editor) ↓ Liveblocks (WebSocket-based
real-time sync) ↓ Next.js API Routes (Backend) ↓ MongoDB Atlas (Document
storage)

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend

-   Next.js 14 (App Router)
-   TypeScript
-   Tailwind CSS
-   Lexical Editor

### Backend

-   Next.js API Routes
-   Liveblocks (Realtime collaboration)

### Database

-   MongoDB Atlas
-   Mongoose

### Deployment

-   Vercel

------------------------------------------------------------------------

## ⚙️ Setup Instructions

### 1. Clone the repository

git clone https://github.com/uv05709/SyncDraft.git cd SyncDraft

### 2. Install dependencies

npm install

### 3. Create `.env.local`

MONGODB_URI=your_mongodb_connection
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your_liveblocks_public_key

### 4. Run locally

npm run dev

Visit: http://localhost:3000

------------------------------------------------------------------------

## 🚀 Deployment

Deployed using Vercel

------------------------------------------------------------------------

## 🎥 Demo Video

\[Add your YouTube / Drive Link here\]

------------------------------------------------------------------------

## 🧠 AI Tools Used

-   ChatGPT (OpenAI)
-   Codex (OpenAI)
-   Claude (Anthropic)

All generated code was reviewed and modified manually.

------------------------------------------------------------------------

## ⚠️ Known Limitations

-   No authentication system
-   Basic revision handling
-   No offline support

------------------------------------------------------------------------

## 📌 Future Improvements

-   Authentication system
-   Advanced revision history
-   Export document (PDF/Text)
-   Dark mode

------------------------------------------------------------------------

## 🙌 Acknowledgements

-   Liveblocks
-   Lexical
-   MongoDB Atlas
-   Vercel
