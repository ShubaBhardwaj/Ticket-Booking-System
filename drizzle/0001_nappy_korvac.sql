CREATE TABLE "seats" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"isbooked" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email_verified";