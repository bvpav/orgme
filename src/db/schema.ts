import { mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const posts = mysqlTable("posts", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull().default(""),
  imageUrl: varchar("image_url", { length: 255 }),
});
