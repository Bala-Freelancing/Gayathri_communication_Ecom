export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon_name: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          slug: string
          description?: string | null
          icon_name?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon_name?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          sku: string
          slug: string
          name: string
          tagline: string
          description: string
          brand: string
          category_id: string
          badge: string | null
          is_best_seller: boolean
          is_new_launch: boolean
          is_deal_of_the_day: boolean
          original_price: number
          selling_price: number
          rating: number
          review_count: number
          image: string
          gallery: Json
          emi_starts_at: number
          warranty: string
          stock_quantity: number
          in_stock: boolean
          specs: Json
          highlights: Json
          variants: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          sku: string
          slug: string
          name: string
          tagline?: string
          description?: string
          brand: string
          category_id: string
          badge?: string | null
          is_best_seller?: boolean
          is_new_launch?: boolean
          is_deal_of_the_day?: boolean
          original_price: number
          selling_price: number
          rating?: number
          review_count?: number
          image: string
          gallery?: Json
          emi_starts_at?: number
          warranty?: string
          stock_quantity?: number
          in_stock?: boolean
          specs?: Json
          highlights?: Json
          variants?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sku?: string
          slug?: string
          name?: string
          tagline?: string
          description?: string
          brand?: string
          category_id?: string
          badge?: string | null
          is_best_seller?: boolean
          is_new_launch?: boolean
          is_deal_of_the_day?: boolean
          original_price?: number
          selling_price?: number
          rating?: number
          review_count?: number
          image?: string
          gallery?: Json
          emi_starts_at?: number
          warranty?: string
          stock_quantity?: number
          in_stock?: boolean
          specs?: Json
          highlights?: Json
          variants?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          sku: string
          variant_attributes: Json
          original_price: number | null
          selling_price: number | null
          stock_quantity: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          sku: string
          variant_attributes?: Json
          original_price?: number | null
          selling_price?: number | null
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          sku?: string
          variant_attributes?: Json
          original_price?: number | null
          selling_price?: number | null
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          id: string
          product_id: string
          variant_id: string | null
          old_original_price: number
          new_original_price: number
          old_selling_price: number
          new_selling_price: number
          changed_by: string | null
          changed_by_email: string | null
          change_reason: string | null
          changed_at: string
        }
        Insert: {
          id?: string
          product_id: string
          variant_id?: string | null
          old_original_price: number
          new_original_price: number
          old_selling_price: number
          new_selling_price: number
          changed_by?: string | null
          changed_by_email?: string | null
          change_reason?: string | null
          changed_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          variant_id?: string | null
          old_original_price?: number
          new_original_price?: number
          old_selling_price?: number
          new_selling_price?: number
          changed_by?: string | null
          changed_by_email?: string | null
          change_reason?: string | null
          changed_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
        }
        Relationships: []
      }
      catalogue_backups: {
        Row: {
          id: string
          label: string
          product_count: number
          products_snapshot: Json
          created_by: string | null
          created_by_email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          label: string
          product_count: number
          products_snapshot: Json
          created_by?: string | null
          created_by_email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          label?: string
          product_count?: number
          products_snapshot?: Json
          created_by?: string | null
          created_by_email?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_product_price: {
        Args: {
          p_product_id: string
          p_new_original_price: number
          p_new_selling_price: number
          p_reason?: string
          p_variant_id?: string | null
        }
        Returns: Json
      }
      update_product_prices_bulk: {
        Args: {
          p_updates: Json
          p_reason?: string
        }
        Returns: Json
      }
      add_admin_user: {
        Args: {
          p_email: string
          p_role?: string
        }
        Returns: void
      }
      backup_current_catalogue: {
        Args: {
          p_label?: string
          p_workflow?: string
        }
        Returns: Json
      }
      replace_product_catalogue: {
        Args: {
          p_products: Json
          p_backup_label?: string
          p_existing_backup_id?: string
        }
        Returns: Json
      }
      validate_order_stock: {
        Args: {
          p_items: Json
        }
        Returns: Json
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
