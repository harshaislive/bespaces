import { Card as CardType } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CardProps {
  card: CardType;
  isOwner?: boolean;
  onLike?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function Card({ card, isOwner, onLike, onEdit, onDelete }: CardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case '3d': return 'bg-amber-500';
      case 'ai': return 'bg-purple-500';
      case 'design': return 'bg-blue-500';
      case 'tools': return 'bg-emerald-500';
      case 'development': return 'bg-rose-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div 
      className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link 
        href={card.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block p-6"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{card.title}</h3>
          <div className="flex items-center">
            <span className={`text-xs px-2 py-1 rounded-full text-white ${getCategoryColor(card.category)}`}>
              {card.category}
            </span>
          </div>
        </div>

        <p className="text-muted-foreground mb-6 line-clamp-2">{card.description}</p>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Added {formatDistanceToNow(new Date(card.created_at))} ago</span>
          </div>
          <div className="flex items-center gap-3">
            {card.tag && (
              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                {card.tag}
              </span>
            )}
            <button 
              onClick={(e) => {
                e.preventDefault();
                onLike?.(card.id);
              }}
              className="flex items-center gap-1 hover:text-primary"
            >
              <span>❤️</span>
              <span>{card.likes}</span>
            </button>
          </div>
        </div>
      </Link>

      {isOwner && (
        <div className="flex border-t divide-x">
          <button 
            onClick={() => onEdit?.(card.id)}
            className="flex-1 p-2 text-sm hover:bg-muted text-center"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete?.(card.id)}
            className="flex-1 p-2 text-sm hover:bg-destructive hover:text-white text-center"
          >
            Delete
          </button>
        </div>
      )}
    </motion.div>
  );
} 