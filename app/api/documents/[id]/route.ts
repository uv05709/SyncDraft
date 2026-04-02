import { NextRequest, NextResponse } from "next/server";
import { getDocumentById, updateDocument } from "@/lib/documents";

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
