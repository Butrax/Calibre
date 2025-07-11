import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Download } from 'lucide-react';
import type { Book } from '@/lib/types';
import { Button } from '@/components/ui/button';

async function getBookById(id: string): Promise<Book | null> {
  const calibreDir = path.join(process.cwd(), 'src', 'calibre');
  const decodedPath = Buffer.from(id, 'base64url').toString('utf8');
  const [authorName, bookFolderName] = decodedPath.split('/');

  if (!authorName || !bookFolderName) return null;

  try {
      const bookPath = path.join(calibreDir, authorName, bookFolderName);
      if (fs.existsSync(bookPath)) {
        const files = fs.readdirSync(bookPath);

        const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));
        const coverFile = files.find(f => f.toLowerCase() === 'cover.jpg');

        if (pdfFile && coverFile) {
          const titleMatch = bookFolderName.match(/^(.*)\s\(\d+\)$/);
          const title = titleMatch ? titleMatch[1] : bookFolderName;

          return {
            id: id,
            title: title,
            author: authorName,
            coverUrl: `/api/calibre/cover/${authorName}/${bookFolderName}/${coverFile}`,
            pdfUrl: `/api/calibre/pdf/${authorName}/${bookFolderName}/${pdfFile}`,
            aiHint: 'book cover',
          };
        }
      }
  } catch (error) {
    console.error("Erreur lors de la lecture de la bibliothèque Calibre:", error);
    return null;
  }
  
  return null;
}

export default async function ReadBookPage({ params }: { params: { id: string } }) {
  const book = await getBookById(params.id);

  if (!book) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-background/80 backdrop-blur-sm border-b md:px-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/" aria-label="Retour à la bibliothèque">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="text-center flex-1 mx-4 overflow-hidden">
            <h1 className="font-headline text-lg font-semibold truncate" title={book.title}>
                {book.title}
            </h1>
            <p className="text-sm text-muted-foreground truncate">{book.author}</p>
        </div>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <a href={book.pdfUrl} download={`${book.title}.pdf`}>
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Télécharger</span>
          </a>
        </Button>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="w-full h-full">
            <iframe
              src={book.pdfUrl}
              title={`Lecteur PDF pour ${book.title}`}
              className="w-full h-full border-none"
            />
        </div>
      </main>
    </div>
  );
}
