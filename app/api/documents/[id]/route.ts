import { NextRequest, NextResponse } from "next/server";
import { deleteDocument, getDocumentById, updateDocument } from "@/lib/documents";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const document = await getDocumentById(params.id);
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }
    return NextResponse.json({ document });
  } catch (error) {
    console.error("Failed to get document", error);
    return NextResponse.json(
      { error: "Unable to fetch document" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json().catch(() => ({}));
    const title =
      typeof body.title === "string" ? body.title.slice(0, 140) : undefined;
    const touch = Boolean(body.touch);

    if (!title && !touch) {
      return NextResponse.json(
        { error: "No valid updates were supplied" },
        { status: 400 }
      );
    }

    const updated = await updateDocument(params.id, { title, touch });
    if (!updated) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ document: updated });
  } catch (error) {
    console.error("Failed to update document", error);
    return NextResponse.json(
      { error: "Unable to update document" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const documentId = params.id?.trim();
    if (!documentId) {
      return NextResponse.json(
        { error: "Document id is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteDocument(documentId);
    if (!deleted) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Document deleted",
      document: deleted.document,
      deletedRevisions: deleted.deletedRevisions
    });
  } catch (error) {
    console.error("Failed to delete document", error);
    return NextResponse.json(
      { error: "Unable to delete document" },
      { status: 500 }
    );
  }
}
