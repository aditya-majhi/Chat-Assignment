import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { chats } from "./chats.schema";

export const messages = pgTable("message", {
    id: text("id").primaryKey(),

    conversationId: text("conversation_id")
        .notNull()
        .references(() => chats.id, { onDelete: "cascade" }),

    role: text("role", {
        enum: ["user", "assistant"],
    }).notNull(),

    //Type of response (text || tool)
    kind: text("kind", {
        enum: ["text", "tool"],
    }).notNull(),

    //Tool used
    toolName: text("tool_name"),

    content: jsonb("content").notNull(),

    createdAt: timestamp("created_at").defaultNow(),
});
