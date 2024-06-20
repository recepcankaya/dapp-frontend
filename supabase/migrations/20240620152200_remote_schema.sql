drop policy "Enable SELECT for all" on "public"."brand";

drop policy "Enable SELECT for All" on "public"."brand_branch";

drop function if exists "public"."edit_product_from_menu"(p_brand_branch_id uuid, p_product_id integer, p_new_price text, p_new_description text);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.edit_product_from_menu(p_brand_branch_id uuid, p_product_id integer, p_new_price text, p_new_description text, p_new_image text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
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
                    product := jsonb_set(product, '{image}', to_jsonb(p_new_image));
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.add_campaign(row_id uuid, name text, image text, favourite boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.add_product_to_menu(p_product_name text, p_description text, p_price text, p_product_image text, p_category text, p_brand_branch_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.add_product_to_menu(product_name text, message text, price text, image_url text, category text, user_id text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    RAISE NOTICE 'Product Name: %', product_name;
    RAISE NOTICE 'Message: %', message;
    RAISE NOTICE 'Price: %', price;
    RAISE NOTICE 'Image URL: %', image_url;
    RAISE NOTICE 'Category: %', category;
    RAISE NOTICE 'User ID: %', user_id;

    -- Your existing function logic here

END;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_product_from_menu(p_brand_branch_id uuid, p_product_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
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
END;$function$
;

CREATE OR REPLACE FUNCTION public.delete_spesific_campaign(row_id uuid, object_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
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
END;$function$
;

create policy "Enable SELECT for all"
on "public"."brand"
as permissive
for select
to authenticated, anon
using (true);


create policy "Enable SELECT for All"
on "public"."brand_branch"
as permissive
for select
to authenticated, anon
using (true);



