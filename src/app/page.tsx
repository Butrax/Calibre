import Link from 'next/link';
import { Settings } from 'lucide-react';
import { BookCard } from '@/components/book-card';
import { mockBooks } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-4 pt-8 md:px-6 lg:pt-12">
        <div className="relative text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl">
            Lecteur Calibre
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
            Votre bibliothèque Calibre, accessible partout.
          </p>
          <div className="absolute top-0 right-0">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/settings" aria-label="Paramètres">
                <Settings className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="px-4 py-8 md:px-6 md:py-12">
        <section>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 md:gap-6">
            {mockBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
