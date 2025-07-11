import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { BookCard } from '@/components/book-card';
import { Button } from '@/components/ui/button';
import type { Book } from '@/lib/types';

async function getCalibreBooks(): Promise<Book[]> {
  const calibreDir = path.join(process.cwd(), 'src', 'calibre');
  let books: Book[] = [];

  try {
    if (fs.existsSync(calibreDir)) {
      const authorFolders = fs.readdirSync(calibreDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory());

      for (const authorFolder of authorFolders) {
        const authorPath = path.join(calibreDir, authorFolder.name);
        const bookFolders = fs.readdirSync(authorPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory());

        for (const bookFolder of bookFolders) {
          const bookPath = path.join(authorPath, bookFolder.name);
          const files = fs.readdirSync(bookPath);

          const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));
          const coverFile = files.find(f => f.toLowerCase() === 'cover.jpg');

          if (pdfFile && coverFile) {
            const bookId = `${authorFolder.name}-${bookFolder.name}`; // Simple ID generation
            
            // Extract book title from folder name (remove calibre id if present)
            const titleMatch = bookFolder.name.match(/^(.*)\s\(\d+\)$/);
            const title = titleMatch ? titleMatch[1] : bookFolder.name;

            books.push({
              id: bookId,
              title: title,
              author: authorFolder.name,
              coverUrl: `/calibre/${authorFolder.name}/${bookFolder.name}/${coverFile}`,
              pdfUrl: `/calibre/${authorFolder.name}/${bookFolder.name}/${pdfFile}`,
              aiHint: 'book cover',
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors de la lecture de la bibliothèque Calibre:", error);
    // Return empty array or mock data on error
    return [];
  }
  
  return books;
}

export default async function Home() {
  const books = await getCalibreBooks();

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
          {books.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 md:gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Aucun livre trouvé dans le dossier `src/calibre`.</p>
              <p className="text-sm">Assurez-vous que vos livres sont organisés dans `src/calibre/Auteur/Titre/` et contiennent un `cover.jpg` et un fichier `.pdf`.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
