import { NextRequest, NextResponse } from "next/server";
import { listRevisions, saveRevisionSnapshot } from "@/lib/revisions";

export async function GET(request: NextRequest) {
  try {
    const documentId = request.nextUrl.searchParams.get("documentId");
    if (!documentId) {
      return NextResponse.json(
        { error: "documentId is required" },
        { status: 400 }
      );
    }

    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 50;

    const revisions = await listRevisions(
      documentId,
      Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 50
    );

    return NextResponse.json({ revisions });
  } catch (error) {
    console.error("Failed to fetch revisions", error);
    return NextResponse.json(
      { error: "Unable to fetch revisions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const documentId =
      typeof body.documentId === "string" ? body.documentId.trim() : "";
    const content = typeof body.content === "string" ? body.content : "";
    const updatedBy =
      typeof body.updatedBy === "string" && body.updatedBy.trim()
        ? body.updatedBy.trim().slice(0, 80)
        : null;

    if (!documentId || !content) {
      return NextResponse.json(
        { error: "documentId and content are required" },
        { status: 400 }
      );
    }

    const result = await saveRevisionSnapshot({
      documentId,
      content,
      updatedBy
    });

    return NextResponse.json(result, { status: result.created ? 201 : 200 });
  } catch (error) {
    console.error("Failed to save revision", error);
    return NextResponse.json(
      { error: "Unable to save revision" },
      { status: 500 }
    );
  }
}
