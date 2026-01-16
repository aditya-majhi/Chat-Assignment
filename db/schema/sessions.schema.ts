import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const sessions = pgTable('session', {
    sessionToken: text('session_token').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires').notNull(),
});