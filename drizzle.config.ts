import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const host = encodeURIComponent(process.env["DATABASE_HOST"]!);
const user = encodeURIComponent(process.env["DATABASE_USERNAME"]!);
const password = encodeURIComponent(process.env["DATABASE_PASSWORD"]!);
const database = encodeURIComponent(process.env["DATABASE_NAME"]!);
const opts = new URLSearchParams([
  ["ssl", JSON.stringify({ rejectUnauthorized: true })],
]);

const connectionString = `mysql://${user}:${password}@${host}/${database}?${opts}`;
console.log(connectionString);

export default {
  schema: "./src/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString,
  },
} satisfies Config;
