
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE SCHEMA IF NOT EXISTS "q";

ALTER SCHEMA "q" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."handle_new_account"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  IF position('@ladderuser.com' IN NEW.email) > 0 THEN
    INSERT INTO public.users (id, created_at)
    VALUES (NEW.id, NEW.created_at);

    RETURN NEW;
  ELSE

    RETURN NEW;
  END IF;
END;$$;

ALTER FUNCTION "public"."handle_new_account"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."brand" (
    "id" "uuid" NOT NULL,
    "email" "text" DEFAULT ''::"text" NOT NULL,
    "created_at" timestamp with time zone,
    "brand_name" "text" DEFAULT ''::"text" NOT NULL,
    "brand_logo_ipfs_url" "text" DEFAULT ''::"text" NOT NULL,
    "nft_src" "text",
    "contract_address" "text",
    "collection_metadata" "jsonb",
    "ticket_ipfs_url" "text" DEFAULT ''::"text" NOT NULL,
    "free_right_image_url" "text" DEFAULT ''::"text" NOT NULL,
    "required_number_for_free_right" numeric DEFAULT '0'::numeric NOT NULL,
    "category" "text" DEFAULT ''::"text" NOT NULL
);

ALTER TABLE "public"."brand" OWNER TO "postgres";

COMMENT ON COLUMN "public"."brand"."brand_logo_ipfs_url" IS 'IPFS url references to brand logo image';

COMMENT ON COLUMN "public"."brand"."nft_src" IS 'The IPFS url references to NFT image';

COMMENT ON COLUMN "public"."brand"."contract_address" IS 'Contract address for business to mint the NFT';

CREATE TABLE IF NOT EXISTS "public"."brand_branch" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "brand_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "branch_name" "text" DEFAULT ''::"text" NOT NULL,
    "total_orders" numeric DEFAULT '0'::numeric NOT NULL,
    "coords" "jsonb" DEFAULT '{}'::"jsonb",
    "total_used_free_rights" numeric DEFAULT '0'::numeric NOT NULL,
    "video_url" "text" DEFAULT ''::"text",
    "campaigns" "jsonb"[],
    "daily_total_orders" numeric DEFAULT '0'::numeric NOT NULL,
    "daily_total_used_free_rights" numeric DEFAULT '0'::numeric NOT NULL,
    "monthly_total_orders" numeric DEFAULT '0'::numeric NOT NULL,
    "email" "text" DEFAULT ''::"text" NOT NULL,
    "weekly_total_orders" "jsonb" DEFAULT '{"cmt": 0, "pzr": 0, "pzt": 0, "cuma": 0, "prş": 0, "salı": 0, "çrş": 0}'::"jsonb" NOT NULL,
    "total_unused_free_rights" numeric DEFAULT '0'::numeric NOT NULL,
    "monthly_total_orders_with_years" "jsonb" DEFAULT '{"2024": {"ekim": 0, "mart": 0, "ocak": 0, "nisan": 0, "eylül": 0, "kasım": 0, "mayıs": 0, "temmuz": 0, "şubat": 0, "aralık": 0, "haziran": 0, "ağustos": 0}, "2025": {"ekim": 0, "mart": 0, "ocak": 0, "nisan": 0, "eylül": 0, "kasım": 0, "mayıs": 0, "temmuz": 0, "şubat": 0, "aralık": 0, "haziran": 0, "ağustos": 0}, "2026": {"ekim": 0, "mart": 0, "ocak": 0, "nisan": 0, "eylül": 0, "kasım": 0, "mayıs": 0, "temmuz": 0, "şubat": 0, "aralık": 0, "haziran": 0, "ağustos": 0}}'::"jsonb" NOT NULL,
    "city" "text" DEFAULT ''::"text" NOT NULL
);

ALTER TABLE "public"."brand_branch" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."employees" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_qr_scan_time" timestamp with time zone DEFAULT "now"(),
    "admin_id" "uuid" DEFAULT "gen_random_uuid"()
);

ALTER TABLE "public"."employees" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "total_ticket_orders" numeric DEFAULT '0'::numeric NOT NULL,
    "user_total_free_rights" numeric DEFAULT '0'::numeric NOT NULL,
    "total_user_orders" numeric DEFAULT '0'::numeric NOT NULL,
    "user_total_used_free_rights" numeric DEFAULT '0'::numeric NOT NULL,
    "last_order_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "branch_id" "uuid" NOT NULL,
    "brand_id" "uuid" NOT NULL
);

ALTER TABLE "public"."user_orders" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "wallet_addr" character varying,
    "last_login" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "username" "text" DEFAULT ''::"text"
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."brand"
    ADD CONSTRAINT "admins_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."brand_branch"
    ADD CONSTRAINT "brand_branch_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_orders"
    ADD CONSTRAINT "user_missions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_walletAddr_key" UNIQUE ("wallet_addr");

CREATE INDEX "brand_branch_brand_id_fkey" ON "public"."brand_branch" USING "btree" ("brand_id");

CREATE INDEX "user_orders_branch_id_idx" ON "public"."user_orders" USING "btree" ("branch_id");

CREATE INDEX "user_orders_brand_id_idx" ON "public"."user_orders" USING "btree" ("brand_id");

CREATE INDEX "user_orders_user_id_idx" ON "public"."user_orders" USING "btree" ("user_id");

ALTER TABLE ONLY "public"."brand"
    ADD CONSTRAINT "admins_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."brand_branch"
    ADD CONSTRAINT "brand_branch_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "public_employees_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."brand"("id");

ALTER TABLE ONLY "public"."user_orders"
    ADD CONSTRAINT "public_user_missions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."user_orders"
    ADD CONSTRAINT "user_orders_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."brand_branch"("id");

ALTER TABLE ONLY "public"."user_orders"
    ADD CONSTRAINT "user_orders_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id");

CREATE POLICY "Enable ALL For All Authenticated Users Based on brand.id" ON "public"."brand" TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Enable ALL For All Authenticated Users Based on brand_id" ON "public"."brand_branch" USING (("auth"."uid"() = "brand_id")) WITH CHECK (("auth"."uid"() = "brand_id"));

CREATE POLICY "Enable ALL For Authenticated Branches Based on branch.id" ON "public"."user_orders" TO "authenticated" USING (("branch_id" = "auth"."uid"())) WITH CHECK (("auth"."uid"() = "branch_id"));

CREATE POLICY "Enable ALL For Authenticated Users Based on branch.id" ON "public"."brand_branch" TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Enable ALL For Authenticated Users Based on brand.id" ON "public"."user_orders" TO "authenticated" USING (("brand_id" = "auth"."uid"())) WITH CHECK (("auth"."uid"() = "brand_id"));

CREATE POLICY "Enable DELETE for admins based on their admin_id" ON "public"."employees" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "admin_id"));

CREATE POLICY "Enable SELECT For All Authenticated Users" ON "public"."brand" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable SELECT For All Authenticated Users" ON "public"."brand_branch" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable SELECT For All Authenticated Users Based on user_id" ON "public"."user_orders" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));

CREATE POLICY "Enable SELECT for admins based on their admin_id" ON "public"."employees" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "admin_id"));

CREATE POLICY "Enable SELECT for employees based on their ids" ON "public"."employees" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "id"));

ALTER TABLE "public"."brand" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."brand_branch" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."employees" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enable ALL for authenticated users" ON "public"."users" TO "authenticated" USING (true) WITH CHECK (true);

ALTER TABLE "public"."user_orders" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."user_orders";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_account"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_account"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_account"() TO "service_role";

GRANT ALL ON TABLE "public"."brand" TO "anon";
GRANT ALL ON TABLE "public"."brand" TO "authenticated";
GRANT ALL ON TABLE "public"."brand" TO "service_role";

GRANT ALL ON TABLE "public"."brand_branch" TO "anon";
GRANT ALL ON TABLE "public"."brand_branch" TO "authenticated";
GRANT ALL ON TABLE "public"."brand_branch" TO "service_role";

GRANT ALL ON TABLE "public"."employees" TO "anon";
GRANT ALL ON TABLE "public"."employees" TO "authenticated";
GRANT ALL ON TABLE "public"."employees" TO "service_role";

GRANT ALL ON TABLE "public"."user_orders" TO "anon";
GRANT ALL ON TABLE "public"."user_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."user_orders" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
