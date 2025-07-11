import Link from 'next/link';
import { Settings } from 'lucide-react';
import { BookCard } from '@/components/book-card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import type { Book } from '@/lib/types';

async function getDriveBooks(driveUrl: string, apiKey: string): Promise<Book[]> {
  if (!driveUrl || !apiKey) {
    return [];
  }
  
  const folderIdMatch = driveUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (!folderIdMatch) {
    console.error("Invalid Google Drive URL. Couldn't extract folder ID.");
    return [];
  }
  const rootFolderId = folderIdMatch[1];
  
  try {
    const listFiles = async (folderId: string) => {
      const url = new URL('https://www.googleapis.com/drive/v3/files');
      url.searchParams.append('q', `'${folderId}' in parents and trashed = false`);
      url.searchParams.append('key', apiKey);
      url.searchParams.append('fields', 'files(id, name, mimeType)');
      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(`Google Drive API error: ${res.statusText}`);
      }
      const data = await res.json();
      return data.files || [];
    };

    let books: Book[] = [];
    const authorFolders = await listFiles(rootFolderId);

    for (const authorFolder of authorFolders.filter(f => f.mimeType === 'application/vnd.google-apps.folder')) {
      const bookFolders = await listFiles(authorFolder.id);

      for (const bookFolder of bookFolders.filter(f => f.mimeType === 'application/vnd.google-apps.folder')) {
        const files = await listFiles(bookFolder.id);

        const pdfFile = files.find(f => f.mimeType === 'application/pdf');
        const coverFile = files.find(f => f.name.toLowerCase() === 'cover.jpg' && f.mimeType === 'image/jpeg');

        if (pdfFile && coverFile) {
           const titleMatch = bookFolder.name.match(/^(.*)\s\(\d+\)$/);
           const title = titleMatch ? titleMatch[1] : bookFolder.name;
          
           const book: Book = {
            id: bookFolder.id,
            title: title,
            author: authorFolder.name,
            coverUrl: `https://www.googleapis.com/drive/v3/files/${coverFile.id}?alt=media&key=${apiKey}`,
            pdfUrl: `https://www.googleapis.com/drive/v3/files/${pdfFile.id}?alt=media&key=${apiKey}`,
            aiHint: 'book cover',
          };
          books.push(book);
        }
      }
    }
    return books;
  } catch (error) {
    console.error("Erreur lors de la récupération des livres depuis Google Drive:", error);
    // Retourne un tableau vide en cas d'erreur pour ne pas planter la page
    return [];
  }
}

export default async function Home({ searchParams }: { searchParams: { drive_url?: string; api_key?: string } }) {
  const { drive_url, api_key } = searchParams;
  const books = await getDriveBooks(drive_url || '', api_key || '');

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
          {!drive_url || !api_key ? (
             <div className="max-w-2xl mx-auto">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Configuration requise</AlertTitle>
                <AlertDescription>
                  Pour commencer, veuillez vous rendre dans les <Link href="/settings" className="font-bold underline">paramètres</Link> pour connecter votre dossier Google Drive.
                </AlertDescription>
              </Alert>
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 md:gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Aucun livre trouvé dans le dossier Google Drive.</p>
              <p className="text-sm">Vérifiez l'URL, la clé API et que vos livres sont organisés dans `Auteur/Titre/` avec un `cover.jpg` et un fichier `.pdf`.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
