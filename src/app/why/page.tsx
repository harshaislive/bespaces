'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { useState, useEffect } from 'react';
import createSupabaseClient from '@/lib/supabase/supabase-client';
import { User } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';

export default function WhyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  
  useEffect(() => {
    setSupabase(createSupabaseClient());
  }, []);
  
  useEffect(() => {
    if (!supabase) return;
    
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.email?.split('@')[0] || '',
        });
      }
    };
    
    checkUser();
  }, [supabase]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header user={user} />
      
      <div className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-green max-w-none"
        >
          <div className="flex items-center justify-start mb-4">
            <h1 className="text-2xl font-serif font-bold mb-0 text-[#344736]">Why BeSpaces?</h1>
          </div>
          
          <div className="bg-[#e7e4df] rounded-lg p-6 border border-[#d1cec9] mb-8">
            <p className="text-sm italic text-[#342e29]">
              &ldquo;The best ideas come from the collective wisdom of many minds working together. 
              BeSpaces is where our team&apos;s knowledge finds a home, where insights are shared, 
              and where Beforest&apos;s vision takes root.&rdquo;
            </p>
            <p className="text-xs text-right mt-2 text-[#51514d]">— Beforest Team</p>
          </div>
          
          <h2 className="text-xl font-serif font-bold mt-8 mb-4 text-[#344736]">Our Purpose</h2>
          <p className="text-sm text-[#342e29] mb-4">
            At Beforest, we&apos;re building regenerative forest-friendly communities across India. 
            As we grow, so does our collective knowledge, innovative tools, and valuable resources. 
            BeSpaces is our internal portal that brings all these elements together in one place.
          </p>
          
          <h2 className="text-xl font-serif font-bold mt-8 mb-4 text-[#344736]">What You&apos;ll Find Here</h2>
          <ul className="text-sm text-[#342e29] space-y-2 mb-6">
            <li className="flex items-start">
              <span className="text-[#344736] mr-2 mt-0.5">•</span>
              <span><strong>Internal Tools</strong> — Access all the software and tools developed by the Beforest team</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#344736] mr-2 mt-0.5">•</span>
              <span><strong>Workshop Videos</strong> — Recordings of training sessions, workshops, and important meetings</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#344736] mr-2 mt-0.5">•</span>
              <span><strong>Important Documents</strong> — Guidelines, processes, designs, and planning resources</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#344736] mr-2 mt-0.5">•</span>
              <span><strong>Collective Wisdom</strong> — Knowledge shared by team members across all our locations</span>
            </li>
          </ul>
          
          <h2 className="text-xl font-serif font-bold mt-8 mb-4 text-[#344736]">How to Contribute</h2>
          <p className="text-sm text-[#342e29] mb-4">
            BeSpaces thrives on contributions from everyone at Beforest. Have something valuable to share with the team?
          </p>
          <div className="bg-[#f9f7f3] rounded-lg p-6 border border-[#e7e4df] mb-6">
            <p className="text-sm text-[#342e29] mb-2">
              Simply email <a href="mailto:bi@beforest.co" className="text-[#344736] font-medium">bi@beforest.co</a> with:
            </p>
            <ul className="text-sm text-[#342e29] space-y-1 mb-0">
              <li className="flex items-start">
                <span className="text-[#344736] mr-2">1.</span>
                <span>Your resource (or link to it)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#344736] mr-2">2.</span>
                <span>A short description of what it is</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#344736] mr-2">3.</span>
                <span>How it helps the Beforest community</span>
              </li>
            </ul>
          </div>
          
          <h2 className="text-xl font-serif font-bold mt-8 mb-4 text-[#344736]">Our Vision</h2>
          <p className="text-sm text-[#342e29] mb-6">
            BeSpaces isn&apos;t just a repository—it&apos;s a living ecosystem of ideas that helps us:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#344736]/10 p-4 rounded-lg">
              <h3 className="text-base font-serif font-bold mb-2 text-[#344736]">Collaborate Better</h3>
              <p className="text-xs text-[#342e29]">Breaking down silos between teams and collectives</p>
            </div>
            <div className="bg-[#344736]/10 p-4 rounded-lg">
              <h3 className="text-base font-serif font-bold mb-2 text-[#344736]">Share Knowledge</h3>
              <p className="text-xs text-[#342e29]">Ensuring insights and solutions benefit everyone</p>
            </div>
            <div className="bg-[#344736]/10 p-4 rounded-lg">
              <h3 className="text-base font-serif font-bold mb-2 text-[#344736]">Build Community</h3>
              <p className="text-xs text-[#342e29]">Creating stronger bonds across our organization</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              href="/"
              className="inline-block px-4 py-2 rounded-md bg-[#344736] text-[#fdfbf7] text-sm hover:bg-[#415c43] transition-colors shadow-sm"
            >
              Explore BeSpaces
            </Link>
          </div>
        </motion.div>
      </div>
      
      <footer className="py-6 bg-[#e7e4df] border-t border-[#d1cec9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-[#51514d]">© {new Date().getFullYear()} Beforest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 