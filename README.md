# Employee Access Portal

A beautiful access portal with magic link login, card-based resource browsing, and modern UI/UX.

## Features

- 🔑 Magic link login via Supabase authentication
- 🏠 Welcoming top section with user greeting
- 🔲 Cards with links, categories, tags, and interactive UI
- 🔍 Advanced filtering, search, and sorting
- ➕ Add new cards with live preview
- 🎨 Modern, responsive, and polished UI

## Tech Stack

- **Next.js**: App Router for frontend and API
- **Supabase**: Authentication and database
- **TailwindCSS**: Utility-first styling
- **shadcn/ui**: UI component library
- **Framer Motion**: Animations
- **React Hook Form**: Form handling
- **TypeScript**: Type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn
- Supabase account

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/employee-portal.git
   cd employee-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Supabase project and get the API keys

4. Create a `.env.local` file at the root of your project:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase Setup

1. Create a new Supabase project
2. Enable Email Auth with magic links in Authentication > Email
3. Create the following table in the Database:

```sql
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT NOT NULL,
  category TEXT NOT NULL,
  tag TEXT,
  creator_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  likes INT DEFAULT 0
);

-- Set up Row Level Security
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Everyone can view all cards
CREATE POLICY "Anyone can view cards" 
ON cards FOR SELECT 
USING (true);

-- Only authenticated users can insert their own cards
CREATE POLICY "Authenticated users can insert their own cards" 
ON cards FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = creator_id);

-- Only card creators can update their cards
CREATE POLICY "Users can update their own cards" 
ON cards FOR UPDATE 
TO authenticated 
USING (auth.uid() = creator_id);

-- Only card creators can delete their cards
CREATE POLICY "Users can delete their own cards" 
ON cards FOR DELETE 
TO authenticated 
USING (auth.uid() = creator_id);
```

## Deployment

This project can be deployed with Vercel, Netlify, or any other Next.js compatible hosting.

## License

This project is licensed under the MIT License.
