import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "outbound_clicks" (
      "id" serial PRIMARY KEY NOT NULL,
      "slug" varchar NOT NULL,
      "product_name" varchar,
      "vendor" varchar,
      "target" varchar,
      "post_id" integer,
      "referer" varchar,
      "user_agent" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "outbound_clicks"
        ADD CONSTRAINT "outbound_clicks_post_id_posts_id_fk"
        FOREIGN KEY ("post_id") REFERENCES "posts"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "outbound_clicks_slug_idx" ON "outbound_clicks" ("slug");
    CREATE INDEX IF NOT EXISTS "outbound_clicks_post_id_idx" ON "outbound_clicks" ("post_id");
    CREATE INDEX IF NOT EXISTS "outbound_clicks_created_at_idx" ON "outbound_clicks" ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "outbound_clicks" CASCADE;
  `)
}
