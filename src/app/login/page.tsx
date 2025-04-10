'use client';

import { useState, useEffect } from 'react';
import createSupabaseClient from '@/lib/supabase/supabase-client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

// Allowed email domains
const ALLOWED_DOMAINS = ['beforest.co', 'bewild.life'];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  // Effect to initialize Supabase client only on the client-side
  useEffect(() => {
    setSupabase(createSupabaseClient());
  }, []);
  
  // Check if user is already logged in and redirect if they are
  useEffect(() => {
    if (!supabase) return;
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      }
    };
    
    checkSession();
  }, [supabase, router]);
  
  // Check if email domain is allowed
  const isEmailDomainAllowed = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && ALLOWED_DOMAINS.includes(domain);
  };
  
  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      setMessage({ text: 'Client not ready. Please wait.', type: 'error' });
      return;
    }
    
    // Check email domain
    if (!isEmailDomainAllowed(email)) {
      setMessage({ 
        text: `Access restricted to @beforest.co and @bewild.life email addresses only.`, 
        type: 'error' 
      });
      return;
    }
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : ''
        },
      });
      
      if (signInError) {
        throw signInError;
      }
      
      setMessage({
        text: 'Check your email for the login link!',
        type: 'success',
      });
    } catch (error) {
      console.error('Magic link error:', error);
      setMessage({
        text: 'Failed to send magic link. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <div className="w-full bg-gradient-to-r from-[#344736]/90 via-[#7d5a38]/90 to-[#86312b]/90 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-center">
          <span className="text-[#fdfbf7] text-sm font-medium tracking-wider">Internal Knowledge Portal</span>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          className="bg-[#e7e4df] rounded-md shadow-md w-full max-w-md p-6 border border-[#342e29]/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center justify-center gap-2 mb-6">
            <span className="text-2xl font-serif font-bold text-[#344736] tracking-tight">BeSpaces</span>
            <img
              src="/23-Beforest-Black-with-Tagline.png"
              alt="Beforest"
              className="h-10"
            />
          </div>
          
          <p className="text-xs text-[#4b3c35] text-center mb-6">
            Log in to access tools, resources, and knowledge shared within Beforest.
          </p>
          
          <form onSubmit={handleMagicLinkLogin} className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-1 text-[#342e29]">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@beforest.co"
                className="w-full px-3 py-1.5 text-xs rounded-md border border-[#342e29]/20 bg-[#fdfbf7] focus:ring-1 focus:ring-[#344736] focus:outline-none"
                required
              />
              <p className="text-xs text-[#51514d] mt-1">Only @beforest.co and @bewild.life emails are authorized.</p>
            </div>
            
            {message && (
              <div className={`p-2 rounded-md text-xs ${
                message.type === 'success' ? 'bg-[#b8dc99]/30 text-[#415c43]' : 'bg-[#9e3430]/20 text-[#86312b]'
              }`}>
                {message.text}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-1.5 px-3 rounded-md bg-[#344736] text-[#fdfbf7] text-xs hover:bg-[#415c43] disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-1.5">
                  <span className="h-3 w-3 border-2 border-t-transparent border-[#fdfbf7] rounded-full animate-spin" />
                  Sending Magic Link...
                </span>
              ) : (
                'Send Magic Link'
              )}
            </button>
          </form>
          
          <div className="mt-5 text-center text-xs text-[#51514d]">
            <p>Secure access for Beforest team members only.</p>
            <Link href="/" className="text-[#344736] hover:text-[#415c43] mt-2 inline-block">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 