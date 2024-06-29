-- create users
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        SELECT
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4 (),
            'authenticated',
            'authenticated',
            'user' || (ROW_NUMBER() OVER ()) || '@inbucket.com',
            crypt ('password123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        FROM
            generate_series(1, 10)
    );

-- create brand users
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        SELECT
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4 (),
            'authenticated',
            'authenticated',
            'brand' || (ROW_NUMBER() OVER ()) || '@inbucket.com',
            crypt ('password123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        FROM
            generate_series(1, 10)
    );

-- create branch users
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        SELECT
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4 (),
            'authenticated',
            'authenticated',
            'brandbranch' || (ROW_NUMBER() OVER ()) || '@inbucket.com',
            crypt ('password123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        FROM
            generate_series(1, 10)
    );

-- test user email identities
INSERT INTO
    auth.identities (
        id,
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        SELECT
            uuid_generate_v4 (),
            uuid_generate_v4 (),
            id,
            format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        FROM
            auth.users
    );


-- insert users into USERS table
INSERT INTO 
  public.users (
    id,
    username
  ) (
    SELECT
      id,
      'user deneme' || (ROW_NUMBER() OVER ())
    FROM
      auth.users
    WHERE
      email LIKE '%user%'
  );

-- insert brand users into BRAND table
INSERT INTO 
    public.brand (
        id,
        email,
        created_at,
        brand_name,
        brand_logo_url,
        ticket_url,
        free_right_image_url,
        required_number_for_free_right,
        category
    ) (
      SELECT
          id,
          email,
          created_at,
          'brand deneme' || (ROW_NUMBER() OVER ()),
          'https://picsum.photos/200',
          'https://gittjeqpqcmmbterylkd.supabase.co/storage/v1/object/public/brand_tickets/espresso-check-ticket.jpg?t=2024-06-21T07%3A30%3A17.707Z',
          'https://gittjeqpqcmmbterylkd.supabase.co/storage/v1/object/public/brand_free_right_images/espresso-check-not-used-free-right.png?t=2024-06-21T07%3A31%3A11.273Z',
          6,
          'Kahve'
      FROM
          auth.users
      WHERE
          email LIKE '%brand%' AND email NOT LIKE '%brandbranch%'
    );

-- insert branches into BRAND_BRANCH table
INSERT INTO
    public.brand_branch (
        id,
        brand_id,
        branch_name,
        email,
        city,
        coords,
        video_url,
        campaigns,
        total_orders,
        total_unused_free_rights,
        total_used_free_rights,
        daily_total_orders,
        daily_total_used_free_rights,
        monthly_total_orders,
        weekly_total_orders,
        monthly_total_orders_with_years,
        menu
    ) (

        SELECT
            id,
            (SELECT public.brand.id FROM public.brand WHERE public.brand.email LIKE 'brand%' AND REPLACE(public.brand.email, 'brand', '') = REPLACE(auth.users.email, 'brandbranch', '')),
            'branch deneme' || (ROW_NUMBER() OVER (ORDER BY users.email)),
            email,
            'Ankara',
            '{"lat": 39.9334, "long": 32.8597}'::jsonb,
            'https://www.youtube.com/embed/GbaiVH8spag?autoplay=1&mute=1',
            ARRAY[
              '{"campaign_id": "0", "campaign_name": "Kampanya 1", "campaign_image": "https://gittjeqpqcmmbterylkd.supabase.co/storage/v1/object/public/ladderit-local/qpddr97pq4whve6t415hpl25f3kf.jpeg?t=2024-06-23T05%3A25%3A11.635Z", "favourite": true}',
              '{"campaign_id": "1", "campaign_name": "Kampanya 2", "campaign_image": "https://picsum.photos/200", "favourite": false}',
              '{"campaign_id": "2", "campaign_name": "Kampanya 3", "campaign_image": "https://picsum.photos/200", "favourite": false}'
            ]::jsonb[],
            0,
            0,
            0,
            0,
            0,
            0,
            '{
                "cmt": 0,
                "pzr": 0,
                "pzt": 0,
                "cuma": 0,
                "prş": 0,
                "salı": 0,
                "çrş": 0
            }'::jsonb,
            '{
                "2024": {
                    "ekim": 0,
                    "mart": 0,
                    "ocak": 0,
                    "nisan": 0,
                    "eylül": 0,
                    "kasım": 0,
                    "mayıs": 0,
                    "temmuz": 0,
                    "şubat": 0,
                    "aralık": 0,
                    "haziran": 0,
                    "ağustos": 0
                },
                "2025": {
                    "ekim": 0,
                    "mart": 0,
                    "ocak": 0,
                    "nisan": 0,
                    "eylül": 0,
                    "kasım": 0,
                    "mayıs": 0,
                    "temmuz": 0,
                    "şubat": 0,
                    "aralık": 0,
                    "haziran": 0,
                    "ağustos": 0
                },
                "2026": {
                    "ekim": 0,
                    "mart": 0,
                    "ocak": 0,
                    "nisan": 0,
                    "eylül": 0,
                    "kasım": 0,
                    "mayıs": 0,
                    "temmuz": 0,
                    "şubat": 0,
                    "aralık": 0,
                    "haziran": 0,
                    "ağustos": 0
                }
            }'::jsonb,
            ARRAY[
              '{
                "category": "İlk Kategori",
                "categoryID": 0,
                "products": [
                  {
                    "id": 0,
                    "name": "Ürün 1",
                    "price": "10 TL",
                    "description": "İlk ürünün açıklaması",
                    "image": "https://picsum.photos/200"
                  },
                  {
                    "id": 1,
                    "name": "Ürün 2",
                    "price": "20 TL",
                    "description": "İkinci ürünün açıklaması",
                    "image": "https://picsum.photos/200"
                  },
                  {
                    "id": 2,
                    "name": "Ürün 3",
                    "price": "3 TL",
                    "description": "Üçüncü ürünün açıklaması",
                    "image": "https://picsum.photos/200"
                  }
                ]
              }',
              '{
                "category": "İkinci Kategori",
                "categoryID": 1,
                "products": [
                  {
                    "id": 3,
                    "name": "Ürün 4",
                    "price": "40 TL",
                    "description": "Dördüncü ürünün açıklaması",
                    "image": "https://picsum.photos/200"
                  },
                  {
                    "id": 4,
                    "name": "Ürün 5",
                    "price": "50 TL",
                    "description": "Beşinci ürünün açıklaması",
                    "image": "https://picsum.photos/200"
                  },
                  {
                    "id": 6,
                    "name": "Ürün 7",
                    "price": "70 TL",
                    "description": "Yedinci ürünün açıklaması",
                    "image": "https://picsum.photos/200"
                  }
                ]
              }',
              '{
                "category": "Üçüncü Kategori",
                "categoryID": 2,
                "products": [
                  {
                    "id": 7,
                    "name": "Ürün 8",
                    "price": "80 TL",
                    "description": "Sekizinci ürünün açıklaması",
                    "image": "https://picsum.photos/200"
                  },
                  {
                    "id": 8,
                    "name": "Ürün 9",
                    "price": "90 TL",
                    "description": "Dokuzuncu ürünün açıklaması",
                    "image": "https://picsum.photos/200"
                  },
                  {
                    "id": 9,
                    "name": "Ürün 10",
                    "price": "100 TL",
                    "description": "Onuncu ürünün açıklaması",
                    "image": "https://picsum.photos/200"
                  }
                ]
              }',
              '{
                "category": "Dördüncü Kategori",
                "categoryID": 3,
                "products": [
                  {
                    "id": 10,
                    "name": "Ürün 11",
                    "price": "110 TL",
                    "description": "Onbirinci ürünün açıklaması",
                    "image": "https://picsum.photos/200"
                  },
                  {
                    "id": 11,
                    "name": "Ürün 12",
                    "price": "120 TL",
                    "description": "Onikinci ürünün açıklaması",
                    "image": "https://picsum.photos/200"
                  },
                  {
                    "id": 12,
                    "name": "Ürün 13",
                    "price": "130 TL",
                    "description": "Onüçüncü ürünün açıklaması",
                    "image": "https://picsum.photos/200"
                  }
                ]
              }',
              '{
                "category": "Beşinci Kategori",
                "categoryID": 4,
                "products": [
                  {
                    "id": 13,
                    "name": "Ürün 14",
                    "price": "140 TL",
                    "description": "Ondördüncü ürünün açıklaması",
                    "image": "https://picsum.photos/200"
                  },
                  {
                    "id": 14,
                    "name": "Ürün 15",
                    "price": "150 TL",
                    "description": "Onbeşinci ürünün açıklaması",
                    "image": "https://picsum.photos/200"
                  },
                  {
                    "id": 15,
                    "name": "Ürün 16",
                    "price": "160 TL",
                    "description": "Onaltıncı ürünün açıklaması",
                    "image": "https://picsum.photos/200"
                  }
                ]
              }'
            ]::jsonb[]
        FROM
            auth.users
        WHERE
            auth.users.email LIKE '%brandbranch%'
    );

INSERT INTO storage.buckets
  (id, name, public)
VALUES
  ('campaigns', 'campaigns', true);

COMMIT;
