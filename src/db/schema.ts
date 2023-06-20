import { datetime, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const posts = mysqlTable("posts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull().default(""),
  description: text("description").notNull().default(""),
  imageUrl: varchar("image_url", { length: 255 }), // TODO: add unique constraint
  createdAt: datetime("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});
