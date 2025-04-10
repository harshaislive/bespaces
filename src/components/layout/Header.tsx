import Link from 'next/link';
import { User } from '@/types';
import { useEffect, useState } from 'react';
import createSupabaseClient from '@/lib/supabase/supabase-client';
import { useRouter } from 'next/navigation';
import { SupabaseClient } from '@supabase/supabase-js';
import Image from 'next/image';

interface HeaderProps {
  user?: User | null;
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  
  useEffect(() => {
    setSupabase(createSupabaseClient());
  }, []);
  
  const handleLogout = async () => {
    if (!supabase) return;
    
    await supabase.auth.signOut();
    router.push('/login');
  };
  
  return (
    <header className="w-full border-b border-[#e7e4df] bg-[#fdfbf7] shadow-sm">
      <div className="w-full gradient-header py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-center">
          <span className="text-[#fdfbf7] text-sm font-medium tracking-wider">Internal Knowledge Portal</span>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 py-4 px-4">
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="flex items-center">
            <Image 
              src="/23-Beforest-Black-with-Tagline.png" 
              alt="Beforest" 
              width={192}
              height={48}
              className="h-10 sm:h-12 w-auto"
            />
          </Link>
          <div className="h-8 w-px bg-[#e7e4df]"></div>
          <Link href="/" className="flex items-center">
            <span className="text-xl font-serif font-bold text-[#344736] tracking-tight">BeSpaces</span>
          </Link>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Link 
            href="/why" 
            className="hidden sm:block text-sm text-[#344736] hover:text-[#415c43] transition-colors mr-4"
          >
            Why BeSpaces?
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-[#51514d]">{user.email}</span>
              <button 
                onClick={handleLogout}
                className="text-xs bg-[#f9f7f3] px-3 py-1.5 rounded-md border border-[#e7e4df] text-[#86312b] hover:bg-[#f5f2ec] transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="px-3 py-1.5 text-xs rounded-md bg-[#344736] text-[#fdfbf7] hover:bg-[#415c43] transition-colors shadow-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 