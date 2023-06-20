import {
  datetime,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const posts = mysqlTable(
  "posts",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    title: varchar("title", { length: 255 }).notNull().default(""),
    description: text("description").notNull().default(""),
    // TODO: add unique constraint whenever drizzle supports it
    imageUrl: varchar("image_url", { length: 255 }).notNull(),
    imageFK: varchar("image_fk", { length: 255 }).notNull(),
    visibility: mysqlEnum("visibility", ["public", "private", "unlisted"])
      .notNull()
      .default("public"),
    createdAt: datetime("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
  },
  (table) => ({
    imageUrlIndex: uniqueIndex("image_url_index").on(table.imageUrl),
    imageFKIndex: uniqueIndex("image_fk_index").on(table.imageFK),
  })
);
