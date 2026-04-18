import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "affiliate_url" varchar;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "product_name" varchar;
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "click_count" numeric DEFAULT 0;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_affiliate_url" varchar;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_product_name" varchar;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_click_count" numeric DEFAULT 0;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "affiliate_url";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "product_name";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "click_count";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_affiliate_url";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_product_name";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_click_count";
  `)
}
