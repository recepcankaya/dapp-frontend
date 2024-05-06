export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brand: {
        Row: {
          brand_logo_ipfs_url: string
          brand_name: string
          collection_metadata: Json | null
          contract_address: string | null
          created_at: string | null
          email: string
          free_right_image_url: string
          id: string
          nft_src: string | null
          required_number_for_free_right: number
          ticket_ipfs_url: string
          total_unused_free_rights: number
        }
        Insert: {
          brand_logo_ipfs_url?: string
          brand_name?: string
          collection_metadata?: Json | null
          contract_address?: string | null
          created_at?: string | null
          email?: string
          free_right_image_url?: string
          id: string
          nft_src?: string | null
          required_number_for_free_right?: number
          ticket_ipfs_url?: string
          total_unused_free_rights?: number
        }
        Update: {
          brand_logo_ipfs_url?: string
          brand_name?: string
          collection_metadata?: Json | null
          contract_address?: string | null
          created_at?: string | null
          email?: string
          free_right_image_url?: string
          id?: string
          nft_src?: string | null
          required_number_for_free_right?: number
          ticket_ipfs_url?: string
          total_unused_free_rights?: number
        }
        Relationships: [
          {
            foreignKeyName: "admins_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_branch: {
        Row: {
          branch_name: string
          brand_id: string
          campaigns: Json[] | null
          coords: Json | null
          daily_total_orders: number
          daily_total_used_free_rights: number
          email: string
          id: string
          monthly_total_orders: number
          total_orders: number
          total_used_free_rights: number
          video_url: string | null
        }
        Insert: {
          branch_name?: string
          brand_id?: string
          campaigns?: Json[] | null
          coords?: Json | null
          daily_total_orders?: number
          daily_total_used_free_rights?: number
          email?: string
          id?: string
          monthly_total_orders?: number
          total_orders?: number
          total_used_free_rights?: number
          video_url?: string | null
        }
        Update: {
          branch_name?: string
          brand_id?: string
          campaigns?: Json[] | null
          coords?: Json | null
          daily_total_orders?: number
          daily_total_used_free_rights?: number
          email?: string
          id?: string
          monthly_total_orders?: number
          total_orders?: number
          total_used_free_rights?: number
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_branch_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          admin_id: string | null
          created_at: string
          id: string
          last_qr_scan_time: string | null
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          id?: string
          last_qr_scan_time?: string | null
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          id?: string
          last_qr_scan_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_employees_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      user_orders: {
        Row: {
          branch_id: string
          brand_id: string
          created_at: string
          id: string
          last_order_date: string
          total_ticket_orders: number
          total_user_orders: number
          user_id: string
          user_total_free_rights: number
          user_total_used_free_rights: number
        }
        Insert: {
          branch_id: string
          brand_id: string
          created_at?: string
          id?: string
          last_order_date?: string
          total_ticket_orders?: number
          total_user_orders?: number
          user_id?: string
          user_total_free_rights?: number
          user_total_used_free_rights?: number
        }
        Update: {
          branch_id?: string
          brand_id?: string
          created_at?: string
          id?: string
          last_order_date?: string
          total_ticket_orders?: number
          total_user_orders?: number
          user_id?: string
          user_total_free_rights?: number
          user_total_used_free_rights?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_user_missions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_orders_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "brand_branch"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_orders_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          last_login: string | null
          username: string | null
          wallet_addr: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          username?: string | null
          wallet_addr?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          username?: string | null
          wallet_addr?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_admins_not_used_nfts: {
        Args: {
          admin_id: string
        }
        Returns: undefined
      }
      decrement_user_missions_number_of_free_rigths: {
        Args: {
          mission_id: string
        }
        Returns: undefined
      }
      increment_admins_not_used_nfts: {
        Args: {
          admin_id: string
        }
        Returns: undefined
      }
      increment_admins_number_of_orders_so_far: {
        Args: {
          admin_id: string
        }
        Returns: undefined
      }
      increment_admins_used_rewards: {
        Args: {
          admin_id: string
        }
        Returns: undefined
      }
      increment_user_missions_number_of_free_rigths: {
        Args: {
          mission_id: string
        }
        Returns: undefined
      }
      increment_user_missions_number_of_orders: {
        Args: {
          mission_id: string
        }
        Returns: undefined
      }
      increment_user_missions_number_of_orders_so_far: {
        Args: {
          mission_id: string
        }
        Returns: undefined
      }
      increment_user_missions_used_rewards: {
        Args: {
          mission_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
