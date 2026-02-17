export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookmarks: {
        Row: {
          city_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          city_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          city_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cafes: {
        Row: {
          address: string
          city_id: string
          created_at: string
          has_power_outlet: boolean
          id: string
          images: string[]
          name: string
          noise_level: number
          price_range: number
          rating: number
          wifi_speed: number
        }
        Insert: {
          address: string
          city_id: string
          created_at?: string
          has_power_outlet?: boolean
          id?: string
          images?: string[]
          name: string
          noise_level?: number
          price_range?: number
          rating?: number
          wifi_speed?: number
        }
        Update: {
          address?: string
          city_id?: string
          created_at?: string
          has_power_outlet?: boolean
          id?: string
          images?: string[]
          name?: string
          noise_level?: number
          price_range?: number
          rating?: number
          wifi_speed?: number
        }
        Relationships: [
          {
            foreignKeyName: "cafes_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          air_quality: Json
          best_season: string
          bookmark_count: number
          budget_range: string
          cost_of_living: number
          created_at: string
          current_weather: Json
          description: string
          dislikes: number
          environments: string[]
          id: string
          images: string[]
          internet_speed: number
          likes: number
          metrics: Json
          name: string
          name_en: string
          overall_rating: number
          rank: number | null
          region: string
          region_detail: string
          review_count: number
          safety_score: number
          tags: string[]
        }
        Insert: {
          air_quality?: Json
          best_season: string
          bookmark_count?: number
          budget_range: string
          cost_of_living?: number
          created_at?: string
          current_weather?: Json
          description: string
          dislikes?: number
          environments?: string[]
          id: string
          images?: string[]
          internet_speed?: number
          likes?: number
          metrics?: Json
          name: string
          name_en: string
          overall_rating?: number
          rank?: number | null
          region: string
          region_detail: string
          review_count?: number
          safety_score?: number
          tags?: string[]
        }
        Update: {
          air_quality?: Json
          best_season?: string
          bookmark_count?: number
          budget_range?: string
          cost_of_living?: number
          created_at?: string
          current_weather?: Json
          description?: string
          dislikes?: number
          environments?: string[]
          id?: string
          images?: string[]
          internet_speed?: number
          likes?: number
          metrics?: Json
          name?: string
          name_en?: string
          overall_rating?: number
          rank?: number | null
          region?: string
          region_detail?: string
          review_count?: number
          safety_score?: number
          tags?: string[]
        }
        Relationships: []
      }
      city_likes: {
        Row: {
          action: string
          city_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          action: string
          city_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          city_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_likes_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "city_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          occupation: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          name: string
          occupation?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          occupation?: string | null
        }
        Relationships: []
      }
      review_helpful: {
        Row: {
          created_at: string
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_helpful_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_helpful_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          city_id: string
          comment_count: number
          content: string
          created_at: string
          helpful_count: number
          id: string
          images: string[]
          is_verified: boolean
          occupation: string | null
          overall_rating: number
          ratings: Json
          recommended_season: string[]
          stay_duration: string | null
          user_id: string
        }
        Insert: {
          city_id: string
          comment_count?: number
          content: string
          created_at?: string
          helpful_count?: number
          id?: string
          images?: string[]
          is_verified?: boolean
          occupation?: string | null
          overall_rating: number
          ratings?: Json
          recommended_season?: string[]
          stay_duration?: string | null
          user_id: string
        }
        Update: {
          city_id?: string
          comment_count?: number
          content?: string
          created_at?: string
          helpful_count?: number
          id?: string
          images?: string[]
          is_verified?: boolean
          occupation?: string | null
          overall_rating?: number
          ratings?: Json
          recommended_season?: string[]
          stay_duration?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
