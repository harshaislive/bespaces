import { User } from '@/types';

interface WelcomeSectionProps {
  user?: User | null;
}

export function WelcomeSection({ user }: WelcomeSectionProps) {
  return (
    <section className="w-full bg-gradient-to-r from-primary/10 to-accent/10 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          {user ? `Welcome back, ${user.name || user.email}!` : 'Welcome to Employee Portal!'}
        </h1>
        <p className="text-muted-foreground">
          Explore your curated tools and spaces. Everything you need in one place.
        </p>
        
        <div className="flex items-center gap-4 mt-6">
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
            <span className="text-lg">✚</span> Add New Card
          </button>
          <button className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center gap-2">
            <span className="text-lg">📂</span> View My Cards
          </button>
          <button className="px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground flex items-center gap-2">
            <span className="text-lg">🔁</span> Refresh Feed
          </button>
        </div>
      </div>
    </section>
  );
} 