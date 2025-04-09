export type Category = 'All' | 'Tools' | 'Videos' | 'Documents' | 'Knowledge';
export type SortOption = 'Relevance' | 'Date' | 'Likes';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  link: string;
  category: Category;
  tag?: string;
  creator_id: string;
  creator_name: string;
  created_at: string;
  likes: number;
  featured?: boolean;
} 