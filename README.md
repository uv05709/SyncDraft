# SyncDraft

SyncDraft is a polished, real-time collaborative editor built with Next.js, TypeScript, Liveblocks, Lexical, Tailwind CSS, and MongoDB Atlas.

## Features

- Landing dashboard with hero + create/join flows
- Real-time collaborative rich-text editor (Liveblocks + Lexical)
- Presence indicators for active collaborators
- Editable document title with auto-save status
- Document metadata persistence in MongoDB
- Recent documents list
- Share link copy action
- Responsive, hackathon-ready UI

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Liveblocks (`@liveblocks/react-lexical`)
- Lexical
- MongoDB Atlas + Mongoose

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"
LIVEBLOCKS_SECRET_KEY="sk_prod_xxxxxxxxxxxxxxxxx"
```

3. Run locally:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## Deployment (Vercel)

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add environment variables:
   - `MONGODB_URI`
   - `LIVEBLOCKS_SECRET_KEY`
4. Deploy.

## API routes

- `POST /api/liveblocks-auth` -> authenticates users into Liveblocks rooms
- `GET /api/documents` -> list recent documents
- `POST /api/documents` -> create new document
- `GET /api/documents/:id` -> get document metadata
- `PATCH /api/documents/:id` -> update title/timestamp
