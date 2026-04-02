import { randomUUID } from "crypto";
import { Liveblocks } from "@liveblocks/node";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { buildGuestUser } from "@/lib/liveblocks";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.LIVEBLOCKS_SECRET_KEY;
    if (!secret) {
      return new Response(
        JSON.stringify({ error: "Missing LIVEBLOCKS_SECRET_KEY" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const liveblocks = new Liveblocks({
      secret
    });

    const requestBody = (await request.json().catch(() => null)) as
      | { room?: string }
      | null;
    const room =
      typeof requestBody?.room === "string" ? requestBody.room.trim() : "";

    if (!room) {
      return new Response(JSON.stringify({ error: "Room is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!/^[\w:-]{1,120}$/.test(room)) {
      return new Response(JSON.stringify({ error: "Invalid room format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const cookieStore = cookies();
    const existingUserId = cookieStore.get("syncdraft_user_id")?.value;
    const userId = existingUserId || `guest_${randomUUID()}`;
    const user = buildGuestUser(userId);

    const session = liveblocks.prepareSession(user.id, {
      userInfo: user.info
    });

    session.allow(room, session.FULL_ACCESS);
    const { body: authBody, status } = await session.authorize();

    const response = new Response(authBody, {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    });

    if (!existingUserId) {
      const secureAttr = process.env.NODE_ENV === "production" ? "; Secure" : "";
      response.headers.append(
        "Set-Cookie",
        `syncdraft_user_id=${userId}; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly${secureAttr}`
      );
    }

    return response;
  } catch (error) {
    console.error("Liveblocks auth error", error);
    return new Response(JSON.stringify({ error: "Authentication failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
