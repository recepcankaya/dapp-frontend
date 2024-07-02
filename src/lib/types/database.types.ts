export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      brand: {
        Row: {
          brand_logo_url: string;
          brand_name: string;
          category: string;
          created_at: string | null;
          email: string;
          free_right_image_url: string;
          id: string;
          required_number_for_free_right: number;
          ticket_url: string;
        };
        Insert: {
          brand_logo_url?: string;
          brand_name?: string;
          category?: string;
          created_at?: string | null;
          email?: string;
          free_right_image_url?: string;
          id: string;
          required_number_for_free_right?: number;
          ticket_url?: string;
        };
        Update: {
          brand_logo_url?: string;
          brand_name?: string;
          category?: string;
          created_at?: string | null;
          email?: string;
          free_right_image_url?: string;
          id?: string;
          required_number_for_free_right?: number;
          ticket_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "brand_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      brand_branch: {
        Row: {
          branch_name: string;
          brand_id: string;
          campaigns: Json[] | null;
          city: string;
          coords: Json | null;
          daily_total_orders: number;
          daily_total_used_free_rights: number;
          email: string;
          id: string;
          menu: Json[] | null;
          monthly_total_orders: number;
          monthly_total_orders_with_years: Json;
          total_orders: number;
          total_unused_free_rights: number;
          total_used_free_rights: number;
          video_url: string | null;
          weekly_total_orders: Json;
        };
        Insert: {
          branch_name?: string;
          brand_id: string;
          campaigns?: Json[] | null;
          city?: string;
          coords?: Json | null;
          daily_total_orders?: number;
          daily_total_used_free_rights?: number;
          email?: string;
          id?: string;
          menu?: Json[] | null;
          monthly_total_orders?: number;
          monthly_total_orders_with_years?: Json;
          total_orders?: number;
          total_unused_free_rights?: number;
          total_used_free_rights?: number;
          video_url?: string | null;
          weekly_total_orders?: Json;
        };
        Update: {
          branch_name?: string;
          brand_id?: string;
          campaigns?: Json[] | null;
          city?: string;
          coords?: Json | null;
          daily_total_orders?: number;
          daily_total_used_free_rights?: number;
          email?: string;
          id?: string;
          menu?: Json[] | null;
          monthly_total_orders?: number;
          monthly_total_orders_with_years?: Json;
          total_orders?: number;
          total_unused_free_rights?: number;
          total_used_free_rights?: number;
          video_url?: string | null;
          weekly_total_orders?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "brand_branch_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "brand_branch_brand_id_fkey1";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brand";
            referencedColumns: ["id"];
          }
        ];
      };
      campaigns: {
        Row: {
          branch_id: string | null;
          id: string;
          image_url: string;
          is_favourite: boolean;
          name: string;
          position: number;
        };
        Insert: {
          branch_id?: string | null;
          id?: string;
          image_url: string;
          is_favourite?: boolean;
          name: string;
          position: number;
        };
        Update: {
          branch_id?: string | null;
          id?: string;
          image_url?: string;
          is_favourite?: boolean;
          name?: string;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "campaigns_branch_id_fkey";
            columns: ["branch_id"];
            isOneToOne: false;
            referencedRelation: "brand_branch";
            referencedColumns: ["id"];
          }
        ];
      };
      employees: {
        Row: {
          created_at: string;
          id: string;
          last_qr_scan_time: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          last_qr_scan_time?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          last_qr_scan_time?: string | null;
        };
        Relationships: [];
      };
      menus: {
        Row: {
          branch_id: string | null;
          category: string;
          description: string | null;
          id: string;
          image_url: string | null;
          name: string;
          position: number;
          price: number | null;
        };
        Insert: {
          branch_id?: string | null;
          category: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name: string;
          position: number;
          price?: number | null;
        };
        Update: {
          branch_id?: string | null;
          category?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          position?: number;
          price?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "menus_branch_id_fkey";
            columns: ["branch_id"];
            isOneToOne: false;
            referencedRelation: "brand_branch";
            referencedColumns: ["id"];
          }
        ];
      };
      user_orders: {
        Row: {
          branch_id: string;
          brand_id: string;
          created_at: string;
          id: string;
          last_order_date: string;
          total_ticket_orders: number;
          total_user_orders: number;
          user_id: string;
          user_total_free_rights: number;
          user_total_used_free_rights: number;
        };
        Insert: {
          branch_id: string;
          brand_id: string;
          created_at?: string;
          id?: string;
          last_order_date?: string;
          total_ticket_orders?: number;
          total_user_orders?: number;
          user_id: string;
          user_total_free_rights?: number;
          user_total_used_free_rights?: number;
        };
        Update: {
          branch_id?: string;
          brand_id?: string;
          created_at?: string;
          id?: string;
          last_order_date?: string;
          total_ticket_orders?: number;
          total_user_orders?: number;
          user_id?: string;
          user_total_free_rights?: number;
          user_total_used_free_rights?: number;
        };
        Relationships: [
          {
            foreignKeyName: "user_orders_branch_id_fkey";
            columns: ["branch_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_orders_branch_id_fkey1";
            columns: ["branch_id"];
            isOneToOne: false;
            referencedRelation: "brand_branch";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_orders_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_orders_brand_id_fkey1";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brand";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_orders_user_id_fkey1";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          id: string;
          username: string | null;
        };
        Insert: {
          id: string;
          username?: string | null;
        };
        Update: {
          id?: string;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_campaign: {
        Args: {
          row_id: string;
          name: string;
          image: string;
          favourite: boolean;
        };
        Returns: undefined;
      };
      add_product_to_menu:
        | {
            Args: {
              p_product_name: string;
              p_description: string;
              p_price: string;
              p_product_image: string;
              p_category: string;
              p_brand_branch_id: string;
            };
            Returns: undefined;
          }
        | {
            Args: {
              product_name: string;
              message: string;
              price: string;
              image_url: string;
              category: string;
              user_id: string;
            };
            Returns: undefined;
          };
      delete_product_from_menu: {
        Args: {
          p_brand_branch_id: string;
          p_product_id: number;
        };
        Returns: undefined;
      };
      delete_spesific_campaign: {
        Args: {
          row_id: string;
          object_id: number;
        };
        Returns: undefined;
      };
      edit_product_from_menu: {
        Args: {
          p_brand_branch_id: string;
          p_product_id: number;
          p_new_price: string;
          p_new_description: string;
          p_new_image: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      app_role: "admin" | "branch" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey";
            columns: ["upload_id"];
            isOneToOne: false;
            referencedRelation: "s3_multipart_uploads";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
