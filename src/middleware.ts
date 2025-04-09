import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Explicitly pass env variables to middleware client
  const supabase = createMiddlewareClient({ req, res }, {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_ANON_KEY!,
  });

  // Refresh session if it exists
  await supabase.auth.getSession();
  
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public image directory)
     * - public directory files
     */
    '/((?!_next/static|_next/image|favicon.ico|images|public).*)',
  ],
}; 