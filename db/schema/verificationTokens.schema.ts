import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const verificationTokens = pgTable(
    "verificationToken",
    {
        email: text("email").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (table) => [
        {
            compoundKey: primaryKey({
                columns: [table.email, table.token],
            }),
        },
    ]
);