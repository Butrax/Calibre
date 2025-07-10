import { BookCard } from '@/components/book-card';
import { mockBooks } from '@/lib/mock-data';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-4 py-8 text-center md:px-6 lg:py-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl">
          Lecteur Calibre
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
          Votre bibliothèque Calibre, accessible partout.
        </p>
      </header>
      <main className="px-4 pb-12 md:px-6">
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
