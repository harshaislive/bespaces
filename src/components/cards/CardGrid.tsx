import { Card } from '@/types';
import { BeSpaceCard } from '@/components/SpaceCard';

interface CardGridProps {
  cards: Card[];
  onLike: (id: string) => void;
  isLoading?: boolean;
  onCardClick?: (card: Card) => void;
}

export function CardGrid({ cards, onLike, isLoading = false, onCardClick }: CardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-[200px] bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <BeSpaceCard
          key={card.id}
          title={card.title}
          description={card.description}
          author={{
            name: card.creator_name || 'Unknown User',
          }}
          likes={card.likes}
          category={card.category}
          link={card.link}
          tag={card.tag}
          onLike={() => onLike(card.id)}
          card={card}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
} 