import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
} 