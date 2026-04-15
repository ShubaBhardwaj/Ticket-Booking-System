import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", { length: 50 }).notNull(),

  email: varchar("email", { length: 255 })
    .notNull()
    .unique(),

  emailVerified: boolean("email_verified").notNull().default(false),

  password: text("password").notNull(),

  salt: text("salt").notNull(),

  role: varchar("role", { length: 20 })
    .notNull()
    .default("customer"),

  isVerified: boolean("is_verified")
    .notNull()
    .default(false),

  verificationToken: text("verification_token"),
  refreshToken: text("refresh_token"),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
