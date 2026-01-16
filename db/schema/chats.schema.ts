import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const chats = pgTable("conversation", {
    id: text("id").primaryKey(),

    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),

    title: text("title").notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
