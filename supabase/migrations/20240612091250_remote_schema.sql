
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

CREATE TYPE "public"."app_role" AS ENUM (
    'admin',
    'branch',
    'user'
);

ALTER TYPE "public"."app_role" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."add_campaign"("row_id" "uuid", "name" "text", "image" "text", "favourite" boolean) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    current_campaigns JSONB[];
    new_campaign JSONB;
    new_campaign_id NUMERIC;
    campaign JSONB;
    updated_campaigns JSONB[];
BEGIN
    -- Retrieve the current campaigns array
    SELECT campaigns
    INTO current_campaigns
    FROM brand_branch
    WHERE id = row_id;

      -- Initialize updated_campaigns array
    updated_campaigns := '{}';

    IF favourite THEN
        -- Check if there is an existing favourite campaign and set its favourite to false
        IF current_campaigns IS NOT NULL THEN
            FOR campaign IN SELECT * FROM unnest(current_campaigns) LOOP
                IF (campaign->>'favourite')::BOOLEAN THEN
                    campaign := jsonb_set(campaign, '{favourite}', 'false'::jsonb);
                END IF;
                -- Add campaign to updated_campaigns array
                updated_campaigns := array_append(updated_campaigns, campaign);
            END LOOP;
        END IF;
    ELSE
        updated_campaigns := current_campaigns;
    END IF;

    -- Check if the campaigns array is NULL
    IF current_campaigns IS NULL THEN
        -- Create a new campaign with campaign_id = 0
        new_campaign := jsonb_build_object(
            'campaign_id', 0,
            'campaign_image', image,
            'campaign_name', name,
            'favourite', favourite
        );

        -- Initialize the campaigns array with the new campaign
        UPDATE brand_branch
        SET campaigns = ARRAY[new_campaign]
        WHERE id = row_id;
    ELSE
        -- Extract the current highest campaign_id
        SELECT MAX((elem->>'campaign_id')::INT)
        INTO new_campaign_id
        FROM unnest(updated_campaigns) AS elem;

        -- Create a new campaign with incremented campaign_id
        new_campaign := jsonb_build_object(
            'campaign_id', new_campaign_id + 1,
            'campaign_image', image,
            'campaign_name', name,
            'favourite', favourite
        );

        -- Add the new campaign to the existing campaigns array
        UPDATE brand_branch
        SET campaigns = array_append(updated_campaigns, new_campaign)
        WHERE id = row_id;
    END IF;
END;$$;

ALTER FUNCTION "public"."add_campaign"("row_id" "uuid", "name" "text", "image" "text", "favourite" boolean) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."add_product_to_menu"("product_name" "text", "message" "text", "price" "text", "image_url" "text", "category" "text", "user_id" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RAISE NOTICE 'Product Name: %', product_name;
    RAISE NOTICE 'Message: %', message;
    RAISE NOTICE 'Price: %', price;
    RAISE NOTICE 'Image URL: %', image_url;
    RAISE NOTICE 'Category: %', category;
    RAISE NOTICE 'User ID: %', user_id;

    -- Your existing function logic here

END;
$$;

ALTER FUNCTION "public"."add_product_to_menu"("product_name" "text", "message" "text", "price" "text", "image_url" "text", "category" "text", "user_id" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."add_product_to_menu"("p_product_name" "text", "p_description" "text", "p_price" "text", "p_product_image" "text", "p_category" "text", "p_brand_branch_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    current_menu JSONB[];
    new_product JSONB;
    new_category JSONB;
    new_product_id NUMERIC;
    new_category_id NUMERIC;
    category_exists BOOLEAN;
    category JSONB;
    updated_menu JSONB[];
BEGIN
    -- Retrieve the current menu
    SELECT menu
    INTO current_menu
    FROM brand_branch
    WHERE id = p_brand_branch_id;

    RAISE NOTICE 'Current menu: %', current_menu;

    -- Initialize flags and IDs
    category_exists := FALSE;
    new_product_id := 0;
    new_category_id := 0;
    updated_menu := '{}';

    -- Check if the menu is not null
    IF current_menu IS NOT NULL THEN
        RAISE NOTICE 'Menu is not null';
        
        -- Find the highest product ID across all categories
        FOR category IN SELECT * FROM unnest(current_menu) LOOP
            SELECT MAX((product->>'id')::NUMERIC)
            INTO new_product_id
            FROM jsonb_array_elements(category->'products') AS product;

            RAISE NOTICE 'Current highest product ID in category %: %', category->>'category', new_product_id;

            -- Find the highest category ID
            SELECT MAX((elem->>'categoryID')::INT)
            INTO new_category_id
            FROM unnest(current_menu) AS elem;

            RAISE NOTICE 'Current highest category ID: %', new_category_id;
        END LOOP;

        -- Increment the product ID for the new product
        new_product_id := new_product_id + 1;
        RAISE NOTICE 'New product ID: %', new_product_id;

        -- Loop through the categories to find if the category already exists
        FOR category IN SELECT * FROM unnest(current_menu) LOOP
            IF category->>'category' = p_category THEN
                category_exists := TRUE;

                -- Create the new product with the unique product ID
                new_product := jsonb_build_object(
                    'id', new_product_id,
                    'name', p_product_name,
                    'image', p_product_image,
                    'price', p_price,
                    'description', p_description
                );

                RAISE NOTICE 'New product: %', new_product;

                -- Update the category's products array
                category := jsonb_set(
                    category,
                    '{products}',
                    (category->'products') || jsonb_build_array(new_product)
                );

                RAISE NOTICE 'Updated category: %', category;

                -- Update the updated_menu array with the modified category
                updated_menu := array_append(updated_menu, category);
            ELSE
                -- Add the existing category to the updated_menu array
                updated_menu := array_append(updated_menu, category);
            END IF;
        END LOOP;
    END IF;

    -- If the category does not exist, create a new category and product
    IF NOT category_exists THEN
        RAISE NOTICE 'Category does not exist. Creating new category.';

        -- Create the new product with the unique product ID
        new_product := jsonb_build_object(
            'id', new_product_id,
            'name', p_product_name,
            'image', p_product_image,
            'price', p_price,
            'description', p_description
        );

        RAISE NOTICE 'New product: %', new_product;

        -- Create the new category with the incremented category ID
        new_category := jsonb_build_object(
            'category', p_category,
            'products', jsonb_build_array(new_product),
            'categoryID', new_category_id + 1
        );

        RAISE NOTICE 'New category: %', new_category;

        -- Update the updated_menu array with the new category
        updated_menu := array_append(updated_menu, new_category);
    END IF;

    -- Update the brand_branch table with the modified menu
    UPDATE brand_branch
    SET menu = updated_menu
    WHERE id = p_brand_branch_id;

    RAISE NOTICE 'Menu updated successfully';
END;$$;

ALTER FUNCTION "public"."add_product_to_menu"("p_product_name" "text", "p_description" "text", "p_price" "text", "p_product_image" "text", "p_category" "text", "p_brand_branch_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_product_from_menu"("p_brand_branch_id" "uuid", "p_product_id" integer) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    current_menu JSONB[];
    updated_menu JSONB[];
    category JSONB;
    updated_products JSONB;
    product JSONB;
    category_needs_removal BOOLEAN;
BEGIN
    -- Retrieve the current menu
    SELECT menu
    INTO current_menu
    FROM brand_branch
    WHERE id = p_brand_branch_id;

    -- Initialize updated_menu array
    updated_menu := '{}';

    -- Check if the menu is not null
    IF current_menu IS NOT NULL THEN
        -- Loop through the categories
        FOR category IN SELECT * FROM unnest(current_menu) LOOP
            category_needs_removal := FALSE;

            -- Filter out the product with the given ID from the products array
            updated_products := '[]';
            FOR product IN SELECT * FROM jsonb_array_elements(category->'products') LOOP
                IF (product->>'id')::INT != p_product_id THEN
                    updated_products := updated_products || jsonb_build_array(product);
                END IF;
            END LOOP;

            -- Check if the updated products array is empty
            IF jsonb_array_length(updated_products) = 0 THEN
                category_needs_removal := TRUE;
            ELSE
                -- Update the category with the new products array
                category := jsonb_set(
                    category,
                    '{products}',
                    updated_products
                );

                -- Add the updated category to the updated_menu array
                updated_menu := array_append(updated_menu, category);
            END IF;
        END LOOP;

        -- If no category needs removal, update the menu
        IF updated_menu IS NOT NULL THEN
            UPDATE brand_branch
            SET menu = updated_menu
            WHERE id = p_brand_branch_id;
        ELSE
            -- If all categories are removed, set menu to an empty array
            UPDATE brand_branch
            SET menu = '{}'
            WHERE id = p_brand_branch_id;
        END IF;
    END IF;
END;$$;

ALTER FUNCTION "public"."delete_product_from_menu"("p_brand_branch_id" "uuid", "p_product_id" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_spesific_campaign"("row_id" "uuid", "object_id" integer) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    current_data jsonb[];
    new_data jsonb[];
    updated_elem jsonb;
BEGIN
    -- Get the current jsonb data
    SELECT campaigns INTO current_data FROM brand_branch WHERE id = row_id;

    -- Iterate over the array and adjust campaign_id
    FOREACH updated_elem IN ARRAY current_data
    LOOP
        IF updated_elem->>'campaign_id' IS NOT NULL AND (updated_elem->>'campaign_id')::int = object_id THEN
            CONTINUE; -- Skip the element to delete
        END IF;

        IF updated_elem->>'campaign_id' IS NOT NULL AND (updated_elem->>'campaign_id')::int > object_id THEN
            updated_elem := jsonb_set(updated_elem, '{campaign_id}', ((updated_elem->>'campaign_id')::int - 1)::text::jsonb);
        END IF;
        
        new_data := new_data || updated_elem;
    END LOOP;

    -- Update the row with the new jsonb data
    UPDATE brand_branch SET campaigns = new_data WHERE id = row_id;
END;$$;

ALTER FUNCTION "public"."delete_spesific_campaign"("row_id" "uuid", "object_id" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."edit_product_from_menu"("p_brand_branch_id" "uuid", "p_product_id" integer, "p_new_price" "text", "p_new_description" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    current_menu JSONB[];
    updated_menu JSONB[];
    category JSONB;
    updated_products JSONB;
    product JSONB;
BEGIN
    -- Retrieve the current menu
    SELECT menu
    INTO current_menu
    FROM brand_branch
    WHERE id = p_brand_branch_id;

    -- Initialize updated_menu array
    updated_menu := '{}';

    -- Check if the menu is not null
    IF current_menu IS NOT NULL THEN
        -- Loop through the categories
        FOR category IN SELECT * FROM unnest(current_menu) LOOP
            -- Initialize updated products array
            updated_products := '[]';

            -- Loop through the products in the current category
            FOR product IN SELECT * FROM jsonb_array_elements(category->'products') LOOP
                IF (product->>'id')::INT = p_product_id THEN
                    -- Update the product's price and description
                    product := jsonb_set(product, '{price}', to_jsonb(p_new_price));
                    product := jsonb_set(product, '{description}', to_jsonb(p_new_description));
                END IF;
                -- Add the (updated) product to the updated products array
                updated_products := updated_products || jsonb_build_array(product);
            END LOOP;

            -- Update the category with the new products array
            category := jsonb_set(
                category,
                '{products}',
                updated_products
            );

            -- Add the updated category to the updated_menu array
            updated_menu := array_append(updated_menu, category);
        END LOOP;

        -- Update the brand_branch table with the modified menu
        UPDATE brand_branch
        SET menu = updated_menu
        WHERE id = p_brand_branch_id;
    END IF;
END;$$;

ALTER FUNCTION "public"."edit_product_from_menu"("p_brand_branch_id" "uuid", "p_product_id" integer, "p_new_price" "text", "p_new_description" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."brand" (
    "email" "text" DEFAULT ''::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text"),
    "brand_name" "text" DEFAULT ''::"text" NOT NULL,
    "brand_logo_url" "text" DEFAULT ''::"text" NOT NULL,
    "ticket_url" "text" DEFAULT ''::"text" NOT NULL,
    "free_right_image_url" "text" DEFAULT ''::"text" NOT NULL,
    "required_number_for_free_right" numeric DEFAULT '0'::numeric NOT NULL,
    "category" "text" DEFAULT ''::"text" NOT NULL,
    "id" "uuid" NOT NULL
);

ALTER TABLE "public"."brand" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."brand_branch" (
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
    "city" "text" DEFAULT ''::"text" NOT NULL,
    "menu" "jsonb"[],
    "brand_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."brand_branch" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."employees" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_qr_scan_time" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."employees" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "total_ticket_orders" numeric DEFAULT '0'::numeric NOT NULL,
    "user_total_free_rights" numeric DEFAULT '0'::numeric NOT NULL,
    "total_user_orders" numeric DEFAULT '0'::numeric NOT NULL,
    "user_total_used_free_rights" numeric DEFAULT '0'::numeric NOT NULL,
    "last_order_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "brand_id" "uuid" NOT NULL,
    "branch_id" "uuid" NOT NULL
);

ALTER TABLE "public"."user_orders" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "last_login" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "username" "text" DEFAULT ''::"text"
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."brand_branch"
    ADD CONSTRAINT "brand_branch_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."brand"
    ADD CONSTRAINT "brand_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_orders"
    ADD CONSTRAINT "user_missions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");

CREATE INDEX "user_orders_user_id_idx" ON "public"."user_orders" USING "btree" ("user_id");

ALTER TABLE ONLY "public"."brand_branch"
    ADD CONSTRAINT "brand_branch_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."brand_branch"
    ADD CONSTRAINT "brand_branch_brand_id_fkey1" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."brand"
    ADD CONSTRAINT "brand_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_orders"
    ADD CONSTRAINT "user_orders_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_orders"
    ADD CONSTRAINT "user_orders_branch_id_fkey1" FOREIGN KEY ("branch_id") REFERENCES "public"."brand_branch"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_orders"
    ADD CONSTRAINT "user_orders_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_orders"
    ADD CONSTRAINT "user_orders_brand_id_fkey1" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_orders"
    ADD CONSTRAINT "user_orders_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Enable ALL for Branches based on branch_id" ON "public"."user_orders" TO "authenticated" USING (("branch_id" = "auth"."uid"())) WITH CHECK (("branch_id" = "auth"."uid"()));

CREATE POLICY "Enable ALL for Branches based on id" ON "public"."brand_branch" TO "authenticated" USING (("id" = "auth"."uid"())) WITH CHECK (("id" = "auth"."uid"()));

CREATE POLICY "Enable ALL for Brands based on brand_id" ON "public"."brand_branch" TO "authenticated" USING (("brand_id" = "auth"."uid"())) WITH CHECK (("brand_id" = "auth"."uid"()));

CREATE POLICY "Enable ALL for Brands based on brand_id" ON "public"."user_orders" USING (("brand_id" = "auth"."uid"())) WITH CHECK (("brand_id" = "auth"."uid"()));

CREATE POLICY "Enable ALL for Brands based on id" ON "public"."brand" TO "authenticated" USING (("id" = "auth"."uid"())) WITH CHECK (("id" = "auth"."uid"()));

CREATE POLICY "Enable SELECT for All" ON "public"."brand_branch" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable SELECT for Users based on user_id" ON "public"."user_orders" FOR SELECT USING (("user_id" = "auth"."uid"()));

CREATE POLICY "Enable SELECT for all" ON "public"."brand" FOR SELECT TO "authenticated" USING (true);

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

GRANT ALL ON FUNCTION "public"."add_campaign"("row_id" "uuid", "name" "text", "image" "text", "favourite" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."add_campaign"("row_id" "uuid", "name" "text", "image" "text", "favourite" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_campaign"("row_id" "uuid", "name" "text", "image" "text", "favourite" boolean) TO "service_role";

GRANT ALL ON FUNCTION "public"."add_product_to_menu"("product_name" "text", "message" "text", "price" "text", "image_url" "text", "category" "text", "user_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."add_product_to_menu"("product_name" "text", "message" "text", "price" "text", "image_url" "text", "category" "text", "user_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_product_to_menu"("product_name" "text", "message" "text", "price" "text", "image_url" "text", "category" "text", "user_id" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."add_product_to_menu"("p_product_name" "text", "p_description" "text", "p_price" "text", "p_product_image" "text", "p_category" "text", "p_brand_branch_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."add_product_to_menu"("p_product_name" "text", "p_description" "text", "p_price" "text", "p_product_image" "text", "p_category" "text", "p_brand_branch_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_product_to_menu"("p_product_name" "text", "p_description" "text", "p_price" "text", "p_product_image" "text", "p_category" "text", "p_brand_branch_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_product_from_menu"("p_brand_branch_id" "uuid", "p_product_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."delete_product_from_menu"("p_brand_branch_id" "uuid", "p_product_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_product_from_menu"("p_brand_branch_id" "uuid", "p_product_id" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_spesific_campaign"("row_id" "uuid", "object_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."delete_spesific_campaign"("row_id" "uuid", "object_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_spesific_campaign"("row_id" "uuid", "object_id" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."edit_product_from_menu"("p_brand_branch_id" "uuid", "p_product_id" integer, "p_new_price" "text", "p_new_description" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."edit_product_from_menu"("p_brand_branch_id" "uuid", "p_product_id" integer, "p_new_price" "text", "p_new_description" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."edit_product_from_menu"("p_brand_branch_id" "uuid", "p_product_id" integer, "p_new_price" "text", "p_new_description" "text") TO "service_role";

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
