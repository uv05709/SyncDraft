import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { updateDocument } from "@/lib/documents";
import { restoreRevisionSnapshot } from "@/lib/revisions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const documentId =
      typeof body.documentId === "string" ? body.documentId.trim() : "";
    const revisionId =
      typeof body.revisionId === "string" ? body.revisionId.trim() : "";
    const updatedBy =
      typeof body.updatedBy === "string" && body.updatedBy.trim()
        ? body.updatedBy.trim().slice(0, 80)
        : null;

    if (!documentId || !revisionId) {
      return NextResponse.json(
        { error: "documentId and revisionId are required" },
        { status: 400 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(revisionId)) {
      return NextResponse.json({ error: "Invalid revisionId" }, { status: 400 });
    }

    const restored = await restoreRevisionSnapshot({
      documentId,
      revisionId,
      updatedBy
    });

    if (!restored) {
      return NextResponse.json({ error: "Revision not found" }, { status: 404 });
    }

    await updateDocument(documentId, { touch: true });

    return NextResponse.json(restored);
  } catch (error) {
    console.error("Failed to restore revision", error);
    return NextResponse.json(
      { error: "Unable to restore revision" },
      { status: 500 }
    );
  }
}
