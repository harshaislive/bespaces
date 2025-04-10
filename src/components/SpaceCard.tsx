import { Heart, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card as CardType } from '@/types'; // Remove unused Category import
import Image from 'next/image'; // Import Image
import { useEffect, useState } from 'react';
import createSupabaseClient from '@/lib/supabase/supabase-client';

// Function to get gradient number based on card ID
const getGradientNumber = (id: string): number => {
  // Use the last character of the ID to determine gradient
  const lastChar = id.slice(-1);
  const charCode = lastChar.charCodeAt(0);
  return (charCode % 10) + 1; // Returns 1-10
};

export type BeSpaceCardProps = {
  // Remove individual props that are now in the card object
  // title: string;
  // description: string;
  // author: {
  //   name: string;
  //   avatar?: string; // Keep avatar if you customize it here
  // };
  // likes?: number;
  // category?: string;
  // link?: string;
  // tag?: string;
  card: CardType; // Pass the whole card object
  onLike?: (id: string) => void;
  onCardClick?: (card: CardType) => void; // Add the click handler prop
  className?: string;
};

export function BeSpaceCard({
  // Remove destructured props that are now in card
  card, // Use the card object
  onLike,
  onCardClick, // Get the click handler
  className,
}: BeSpaceCardProps) {
  // Destructure needed properties from the card object
  const { id, title, description, creator_name, likes, link, tag, creator_avatar, category } = card;
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [supabase] = useState(() => createSupabaseClient());
  
  useEffect(() => {
    if (category === 'Videos' && link) {
      const { data } = supabase.storage.from('bespace-videos').getPublicUrl(link);
      if (data?.publicUrl) {
        setThumbnailUrl(data.publicUrl);
      }
    }
  }, [category, link, supabase]);

  // Create author object, potentially including avatar
  const author = {
    name: creator_name || 'Unknown User',
    avatar: creator_avatar, // Use avatar from card if available
  };

  const gradientNumber = getGradientNumber(id);
  const gradientClass = `card-gradient-${gradientNumber}`;

  const handleClick = () => {
    // Use the passed-in handler
    if (onCardClick) {
      onCardClick(card);
    } else if (link) { 
      // Fallback: Keep original link opening if no handler provided (optional)
      console.warn('BeSpaceCard clicked without onCardClick handler, opening link directly.');
      let correctedLink = link.trim();
      if (!/^https?:\/\//i.test(correctedLink)) {
        correctedLink = `https://${correctedLink}`;
      }
      window.open(correctedLink, '_blank');
    }
  };
  
  // Function to handle mouse movement for the highlight effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top; // y position within the element
    
    // Update the CSS variables for the gradient position
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
    
    // Calculate rotation based on mouse position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8; // Max 8 degrees tilt
    const rotateY = ((x - centerX) / centerX) * 8; // Max 8 degrees tilt
    
    // Apply smooth transform
    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(0)
      scale3d(1.02, 1.02, 1.02)
    `;
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    
    // Reset transform with transition
    card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      translateZ(0)
      scale3d(1, 1, 1)
    `;
  };

  return (
    <div 
      className={cn(
        'space-card relative overflow-hidden rounded-lg shadow-md cursor-pointer',
        gradientClass,
        className
      )}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {category === 'Videos' && thumbnailUrl && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <video
            src={thumbnailUrl}
            className="w-full h-full object-cover"
            preload="metadata"
            muted
            playsInline
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
        </div>
      )}
      <div className="relative z-10 flex flex-col h-full p-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="space-card-title text-[#fdfbf7] font-serif text-lg font-bold line-clamp-2">{title}</h3>
            {tag && (
              <span className="text-[0.65rem] px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full font-medium text-[#fdfbf7] shadow-sm whitespace-nowrap ml-2">
                {tag}
              </span>
            )}
          </div>
          <p className="space-card-description text-[#fdfbf7]/90 text-xs line-clamp-3 mb-4">{description}</p>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {author.avatar ? (
              <Image 
                src={author.avatar} 
                alt={author.name}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full border border-[#fdfbf7]/40"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#fdfbf7]/20 flex items-center justify-center text-[#fdfbf7] text-xs">
                {author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-[#fdfbf7] text-xs truncate max-w-[120px]">{author.name}</span>
          </div>
          
          <button 
            className="flex items-center gap-1 text-[#fdfbf7] text-xs py-1 px-2 rounded-full hover:bg-[#fdfbf7]/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(id);
            }}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{likes}</span>
          </button>
        </div>
      </div>

      {/* Animated Highlight Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
    </div>
  );
} 