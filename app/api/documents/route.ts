import { NextRequest, NextResponse } from "next/server";
import { createDocument, listRecentDocuments } from "@/lib/documents";

export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 12;
    const documents = await listRecentDocuments(
      Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 50) : 12
    );
    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Failed to list documents", error);
    return NextResponse.json(
      { error: "Unable to fetch documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const title =
      typeof body.title === "string" ? body.title.slice(0, 140) : undefined;
    const document = await createDocument({ title });
    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error("Failed to create document", error);
    return NextResponse.json(
      { error: "Unable to create document" },
      { status: 500 }
    );
  }
}
