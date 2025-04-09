import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../database.types';

export default function createSupabaseClient() {
  return createClientComponentClient<Database>({
    supabaseUrl: "https://vapicapmdypzsbltemqg.supabase.co",
    supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhcGljYXBtZHlwenNibHRlbXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0NTM4NjAsImV4cCI6MjA1MjAyOTg2MH0.J6j36QTOhWKGwzN0EdSUrdDzrTn0tBEjUCETZBmeDk8",
  });
} 