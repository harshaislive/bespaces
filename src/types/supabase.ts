export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      cards: {
        Row: {
          id: string;
          title: string;
          description: string;
          link: string;
          category: string;
          tag: string;
          creator_id: string;
          created_at: string;
          likes: number;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          link: string;
          category: string;
          tag?: string;
          creator_id: string;
          created_at?: string;
          likes?: number;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          link?: string;
          category?: string;
          tag?: string;
          creator_id?: string;
          created_at?: string;
          likes?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 