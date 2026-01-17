import { db } from "@/db";
import { chats, messages } from "@/db/schema";
import { authOptions } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch a specific chat with all its messages
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await context.params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const chatId = id;

        const chat = await db
            .select()
            .from(chats)
            .where(and(eq(chats.id, chatId), eq(chats.userId, session.user.id)))
            .limit(1);

        if (chat.length === 0) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        const chatMessages = await db
            .select()
            .from(messages)
            .where(eq(messages.conversationId, chatId))
            .orderBy(messages.createdAt);

        return NextResponse.json({ ...chat[0], messages: chatMessages }, { status: 200 });
    } catch (error) {
        console.error("Error fetching chat:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE: Delete a specific chat and all its messages
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;

        const chat = await db
            .select()
            .from(chats)
            .where(and(eq(chats.id, id), eq(chats.userId, session.user.id)))
            .limit(1);

        if (chat.length === 0) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }

        await db.delete(messages).where(eq(messages.conversationId, id));
        await db.delete(chats).where(eq(chats.id, id));

        return NextResponse.json({ message: "Chat deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting chat:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}