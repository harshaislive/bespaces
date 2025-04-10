'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import createSupabaseClient from '@/lib/supabase/supabase-client';
import { Header } from '@/components/layout/Header';
import { CardGrid } from '@/components/cards/CardGrid';
import { Card as CardType, User, Category } from '@/types';
import { AddCardModal } from '@/components/cards/AddCardModal';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { BeSpaceCard } from '@/components/SpaceCard';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { VideoPlayerModal } from '@/components/VideoPlayerModal';

// Define categories including 'All'
const categories: Category[] = ['All', 'Tools', 'Videos', 'Documents', 'Knowledge'];
const ITEMS_PER_PAGE = 12; // Number of items to load per scroll

export default function Home() {
  const router = useRouter();
  // === State Hooks ===
  const [user, setUser] = useState<User | null>(null);
  const [allSpaces, setAllSpaces] = useState<CardType[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedItemsCount, setDisplayedItemsCount] = useState(ITEMS_PER_PAGE);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

  // === Refs & Observers ===
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false, 
  });

  // === Callbacks ===
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSelectedCategory('All');
  }, []);

  const handleAddSpace = async (
    spaceData: Omit<CardType, 'id' | 'created_at' | 'likes' | 'creator_id' | 'creator_name'> & { videoFile?: FileList }
  ) => {
    if (!user || !supabase) return;

    let finalLink = spaceData.link;

    // --- Video Upload Logic --- 
    if (spaceData.category === 'Videos') {
      if (spaceData.videoFile && spaceData.videoFile.length > 0) {
        const file = spaceData.videoFile[0];
        // Sanitize filename and create unique path
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]+/g, '_');
        const filePath = `${user.id}/${Date.now()}-${sanitizedFileName}`;
        
        try {
          console.log(`Uploading video to: ${filePath}`);
          const { data: uploadData, error } = await supabase.storage
            .from('bespace-videos') // Correct bucket name
            .upload(filePath, file);

          if (error) throw error;

          if (uploadData?.path) {
            finalLink = uploadData.path; // Use the storage path
            console.log(`Upload successful, path: ${finalLink}`);
          } else {
            throw new Error('Upload succeeded but no path returned.');
          }
        } catch (error) {
          console.error('Error uploading video:', error);
          // TODO: Show feedback to user about upload failure
          return; // Stop if upload fails
        }
      } else {
        // No file provided for video category
        console.error('Video category selected but no file provided.');
        // TODO: Show feedback to user
        return; 
      }
    } 
    // --- End Video Upload Logic ---

    // --- Insert Card Data --- 
    try {
      const cardToInsert = {
        title: spaceData.title,
        description: spaceData.description,
        link: finalLink, // Use storage path for videos, original link otherwise
        category: spaceData.category,
        tag: spaceData.tag,
        creator_id: user.id,
        creator_name: user.name || user.email, // Assuming creator_name column exists
      };
      
      console.log('Inserting card data:', cardToInsert);
      const { error: insertError } = await supabase
        .from('cards')
        .insert(cardToInsert);

      if (insertError) {
        console.error('Error inserting card data:', insertError);
        // TODO: Show feedback to user about insert failure
      } else {
        console.log('Card added successfully!');
        // TODO: Optionally trigger modal close here if not handled by form
      }
    } catch (error) {
      console.error('Error in add space operation:', error);
      // TODO: Show generic feedback to user
    }
  };
  
  const handleLikeSpace = async (id: string) => {
    if (!supabase) return;

    try {
      const { data: currentCard, error: fetchError } = await supabase
        .from('cards')
        .select('likes')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      const newLikes = (currentCard?.likes || 0) + 1;
      const { error: updateError } = await supabase
        .from('cards')
        .update({ likes: newLikes })
        .eq('id', id);

      if (updateError) throw updateError;

    } catch (error) {
      console.error('Error liking space:', error);
    }
  };

  // New handler for card clicks (video or link)
  const handleCardClick = (card: CardType) => {
    if (card.category === 'Videos' && card.link && supabase) {
      // Use the correct bucket name 'bespace-videos'
      const { data } = supabase.storage.from('bespace-videos').getPublicUrl(card.link);
      
      if (data?.publicUrl) {
        setCurrentVideoUrl(data.publicUrl);
        setIsVideoModalOpen(true);
      } else {
        console.error('Could not get public URL for video:', card.link);
        // Optionally open the raw link as a fallback or show an error
        if (card.link) {
          let correctedLink = card.link.trim();
          if (!/^https?:\/\//i.test(correctedLink)) {
            correctedLink = `https://${correctedLink}`;
          }
          window.open(correctedLink, '_blank');
        }
      }
    } else if (card.link) {
      // Default behavior: open link in new tab
      let correctedLink = card.link.trim();
      if (!/^https?:\/\//i.test(correctedLink)) {
        correctedLink = `https://${correctedLink}`;
      }
      window.open(correctedLink, '_blank');
    }
  };

  // === Effects ===
  // Load more items effect
  useEffect(() => {
    if (inView && !isLoading) {
      setDisplayedItemsCount(prevCount => prevCount + ITEMS_PER_PAGE);
    }
  }, [inView, isLoading]);

  // Reset displayed items on category or search change effect
  useEffect(() => {
    setDisplayedItemsCount(ITEMS_PER_PAGE);
  }, [selectedCategory, searchTerm]);
  
  // Initialize Supabase client effect
  useEffect(() => {
    setSupabase(createSupabaseClient());
  }, []);
  
  // Auth check effect
  useEffect(() => {
    if (!supabase) return;
    let isMounted = true;
    setIsAuthChecking(true);
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
            if (session?.user) {
            setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.email?.split('@')[0] || '',
            });
            } else {
            router.replace('/login');
            }
        }
      } catch(error) {
          console.error("Auth check failed:", error)
          if (isMounted) router.replace('/login');
      } finally {
        if (isMounted) {
            setIsAuthChecking(false);
        }
      }
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (isMounted) {
            if (session?.user) {
                setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.email?.split('@')[0] || '',
                });
            } else {
                setUser(null);
            }
        }
    });
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase, router]);

  // Fetch spaces & Subscribe effect
  useEffect(() => {
    if (!supabase || !user) return;
    let isMounted = true;
    const fetchSpaces = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .order('created_at', { ascending: false });

        if (!isMounted) return;

        if (error) {
             console.error('Supabase error:', error.message, error.details, error.hint);
             throw error;
        }
        
        const processedData = data?.map(card => ({
          ...card,
          creator_name: card.creator_name || 'Unknown User'
        })) || [];
        
        setAllSpaces(processedData);
      } catch (error) {
        console.error('Error fetching spaces:', error instanceof Error ? error.message : error);
      } finally {
        if (isMounted) {
            setIsLoading(false);
        }
      }
    };

    fetchSpaces();

    const channel = supabase
      .channel('cards_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, (payload) => {
          if (!isMounted) return;
           if (payload.eventType === 'INSERT') {
            const newCard = {
                ...payload.new as CardType,
                creator_name: (payload.new as CardType).creator_name || 'Unknown User'
            };
            setAllSpaces(prev => [newCard, ...prev.filter(c => c.id !== newCard.id)]);
            } else if (payload.eventType === 'UPDATE') {
            setAllSpaces(prev => prev.map((card: CardType) => 
                card.id === payload.new.id ? {
                ...payload.new as CardType,
                creator_name: (payload.new as CardType).creator_name || 'Unknown User'
                } : card
            ));
            } else if (payload.eventType === 'DELETE') {
                 setAllSpaces(prev => prev.filter(card => card.id !== payload.old.id));
            }
      })
      .subscribe();

    return () => {
      isMounted = false;
      channel?.unsubscribe();
    };
  }, [supabase, user]); 
  
  // === Memoized Derived State ===
  const filteredSpaces = useMemo(() => {
    let result = allSpaces;
    if (selectedCategory !== 'All') {
      result = result.filter((card: CardType) => card.category === selectedCategory);
    }
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter((card: CardType) => 
        card.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        card.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        (card.tag && card.tag.toLowerCase().includes(lowerCaseSearchTerm)) ||
        card.creator_name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [allSpaces, selectedCategory, searchTerm]);

  const displayedSpaces = filteredSpaces.slice(0, displayedItemsCount);
  const featuredSpaces = useMemo(() => allSpaces.filter((card: CardType) => card.featured), [allSpaces]);

  // === Conditional Renders ===
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#344736] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#344736] text-sm">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <div className="text-center">
          <p className="text-[#344736] text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }
  
  // === Main Return ===
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Header user={user} />
      
      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Search and Filter Controls */}
          <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Search Input */}
            <div className="md:col-span-1">
              <label htmlFor="search" className="block text-xs font-medium text-[#51514d] mb-1">Search Resources</label>
              <input
                id="search"
                type="text"
                placeholder="Search by title, description, tag..."
                onChange={handleSearchChange}
                className="w-full px-4 py-2 rounded-md border border-[#e7e4df] bg-[#fdfbf7] text-[#342e29] text-sm focus:ring-1 focus:ring-[#344736] focus:border-[#344736] focus:outline-none placeholder-[#51514d]/50"
              />
            </div>
            
            {/* Category Filter Tabs */}
            <div className="md:col-span-2 border-b border-[#e7e4df] pb-2 md:border-none md:pb-0">
              <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-sm transition-colors duration-200',
                      selectedCategory === category
                        ? 'bg-[#344736] text-[#fdfbf7] shadow-sm'
                        : 'text-[#342e29]/70 hover:bg-[#e7e4df] hover:text-[#342e29]'
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Section */}
          {featuredSpaces.length > 0 && selectedCategory === 'All' && searchTerm === '' && (
            <div className="mb-16">
              <h2 className="text-xl font-serif font-bold mb-6 text-[#344736] flex items-center">
                <span className="mr-2">✨</span> Featured Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredSpaces.map((card: CardType) => (
                  <BeSpaceCard
                    key={card.id}
                    card={card}
                    onLike={() => handleLikeSpace(card.id)}
                    onCardClick={handleCardClick}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Resources Section */}
          <div>
             <h2 className="text-xl font-serif font-bold mb-6 text-[#344736] flex items-center">
              <span className="mr-2">
                {searchTerm ? '🔍' : (selectedCategory === 'All' ? '🌿' : '📂')}
              </span> 
              {searchTerm 
                ? `Search Results for "${searchTerm}"`
                : (selectedCategory === 'All' ? 'All Resources' : `${selectedCategory} Resources`)}
            </h2>
          </div>

          {/* Restore Loading/Empty/Grid states */} 
          {isLoading && displayedSpaces.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-[#e7e4df] border-t-[#344736] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#51514d]">Loading Resources...</p>
            </div>
          ) : filteredSpaces.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#342e29] text-lg mb-2">No resources found.</p>
              <p className="text-sm text-[#51514d]">
                {searchTerm 
                  ? `Try adjusting your search term or category.`
                  : `There are no resources in the "${selectedCategory}" category yet.`}
              </p>
            </div>
          ) : (
            // Restore CardGrid usage
            <CardGrid
              cards={displayedSpaces} 
              onLike={handleLikeSpace}
              isLoading={false} 
              onCardClick={handleCardClick}
            />
          )}
          
          {/* Restore Infinite Scroll loader/end message */} 
          {!isLoading && filteredSpaces.length > displayedItemsCount && (
            <div ref={ref} className="text-center py-8">
               <div className="w-8 h-8 border-4 border-[#e7e4df] border-t-[#344736] rounded-full animate-spin mx-auto"></div>
            </div>
          )}
          
          {!isLoading && filteredSpaces.length > 0 && filteredSpaces.length <= displayedItemsCount && displayedItemsCount > ITEMS_PER_PAGE && (
            <div className="text-center py-8">
              <p className="text-sm text-[#51514d]">You&apos;ve reached the end!</p>
            </div>
          )}
        </div>
      </div>

      {/* Restore Footer */} 
      <footer className="py-6 bg-[#e7e4df] border-t border-[#d1cec9] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-[#51514d]">© {new Date().getFullYear()} Beforest. All rights reserved.</p>
        </div>
      </footer>

      {/* Restore AddCardModal */}
      <AddCardModal
        isOpen={false} // This should ideally be controlled by state
        onClose={() => {}} // Need a state setter here, e.g., setIsAddModalOpen(false)
        onSubmit={handleAddSpace} 
        isLoading={false} // Should be linked to an isAdding state
      />

      {/* Restore VideoPlayerModal */}
      <VideoPlayerModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
        videoUrl={currentVideoUrl} 
      />
    </div>
  );
}