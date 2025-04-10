import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card as CardType } from '@/types'; // Remove unused Category import
import Image from 'next/image'; // Import Image

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
  const { id, title, description, creator_name, likes, link, tag, creator_avatar } = card;
  
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
    
    // Calculate position as percentage of the card's dimensions
    const xPercent = Math.round((x / rect.width) * 100);
    const yPercent = Math.round((y / rect.height) * 100);
    
    // Update the CSS variables for the radial gradient position
    card.style.setProperty('--x', `${xPercent}%`);
    card.style.setProperty('--y', `${yPercent}%`);
    
    // Calculate the tilt effect (max 5 degrees in any direction)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 4; // max 4 degrees horizontal tilt
    const rotateX = -((y - centerY) / centerY) * 2; // max 2 degrees vertical tilt
    
    // Apply the 3D rotation
    card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    // Reset to default position
    card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
  };

  return (
    <div 
      className={cn(
        'space-card group relative overflow-hidden rounded-lg p-4 shadow-md transition-all duration-300 hover:shadow-lg',
        gradientClass,
        link && 'cursor-pointer',
        className
      )}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full relative z-10">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="space-card-title text-[#fdfbf7] font-serif text-lg font-bold">{title}</h3>
            {tag && (
              <span className="text-[0.65rem] px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full font-medium text-[#fdfbf7] shadow-sm">
                {tag}
              </span>
            )}
          </div>
          <p className="space-card-description text-[#fdfbf7]/90 text-xs line-clamp-3">{description}</p>
        </div>
        
        <div className="space-card-meta flex items-center justify-between mt-4 pt-3 border-t border-[#fdfbf7]/20">
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
            <span className="text-[#fdfbf7] text-xs">{author.name}</span>
          </div>
          
          <button 
            className="space-card-likes flex items-center gap-1 text-[#fdfbf7] text-xs py-1 px-2 rounded-full hover:bg-[#fdfbf7]/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when liking
              onLike?.(id); // Use the card id
            }}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{likes}</span>
          </button>
        </div>
      </div>

      {/* Animated color overlay for hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
    </div>
  );
} 