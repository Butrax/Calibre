import Link from 'next/link';
import { Settings, Terminal, AlertTriangle } from 'lucide-react';
import { BookCard } from '@/components/book-card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Book } from '@/lib/types';

type GetDriveBooksResult = {
  books: Book[];
  error?: string;
}

type HomePageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

async function getDriveBooks(driveUrl: string, apiKey: string): Promise<GetDriveBooksResult> {
  if (!driveUrl || !apiKey) {
    return { books: [] };
  }
  
  const folderIdMatch = driveUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (!folderIdMatch) {
    const errorMsg = "URL Google Drive invalide. L'ID du dossier n'a pas pu être extrait.";
    console.error(errorMsg);
    return { books: [], error: errorMsg };
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
        const errorData = await res.json().catch(() => null);
        const detail = errorData?.error?.message || res.statusText;
        throw new Error(`Erreur de l'API Google Drive: ${detail}`);
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
            pdfUrl: `https://www.googleapis.com/drive/v3/files/${pdfFile.id}/view?usp=sharing`,
            driveLink: `https://drive.google.com/file/d/${pdfFile.id}/view`,
            aiHint: 'book cover',
          };
          books.push(book);
        }
      }
    }
    return { books };
  } catch (error: any) {
    console.error("Erreur lors de la récupération des livres depuis Google Drive:", error.message);
    return { books: [], error: error.message };
  }
}

export default async function Home({ searchParams }: HomePageProps) {
  const drive_url = typeof searchParams.drive_url === 'string' ? searchParams.drive_url : '';
  const api_key = typeof searchParams.api_key === 'string' ? searchParams.api_key : '';
  const { books, error } = await getDriveBooks(drive_url, api_key);

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
        <section className="max-w-7xl mx-auto">
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
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erreur de connexion à Google Drive</AlertTitle>
                <AlertDescription>
                  <p>Une erreur est survenue : <strong>{error}</strong></p>
                  <p className="mt-2 text-xs">
                    Veuillez vérifier que :<br />
                    1. Votre clé API est correcte.<br />
                    2. L'API Google Drive est bien activée pour votre projet sur la <a href="https://console.cloud.google.com/apis/library/drive.googleapis.com" target="_blank" rel="noopener noreferrer" className="underline">console Google Cloud</a>.<br />
                    3. L'URL du dossier Google Drive est valide.
                  </p>
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
            <div className="text-center text-muted-foreground max-w-2xl mx-auto">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Aucun livre trouvé</AlertTitle>
                <AlertDescription>
                  <p>Aucun livre n'a été trouvé dans le dossier Google Drive fourni.</p>
                  <p className="mt-2 text-xs">Vérifiez l'URL, la clé API, et assurez-vous que vos livres sont organisés dans une structure de dossiers `Auteur/Titre/` avec un `cover.jpg` et un fichier `.pdf` à l'intérieur.</p>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
