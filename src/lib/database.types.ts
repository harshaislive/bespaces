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
      cards: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          link: string
          image: string
          category: string
          is_featured: boolean
          created_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          link: string
          image: string
          category: string
          is_featured?: boolean
          created_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          link?: string
          image?: string
          category?: string
          is_featured?: boolean
          created_by?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          email: string | null
          display_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
        }
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
  }
} 