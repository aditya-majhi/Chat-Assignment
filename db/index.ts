// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Supabase requires SSL
const client = postgres(process.env.DATABASE_URL!, {
    ssl: "require",
});

export const db = drizzle(client, {
    schema,
});
