import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";

export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  isbooked: integer("isbooked").default(0),
});