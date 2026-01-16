import "dotenv/config";
import { defineConfig } from "drizzle-kit";

console.log(process.env.DATABASE_URI);


export default defineConfig({
    dialect: "postgresql",
    schema: "./db/schema",
    out: "./drizzle",

    dbCredentials: {
        url: process.env.DATABASE_URI!,
    },

    strict: true,
    verbose: true,
});
