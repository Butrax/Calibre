import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Download } from 'lucide-react';

import { mockBooks } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

export default function ReadBookPage({ params }: { params: { id: string } }) {
  const book = mockBooks.find((b) => b.id === params.id);

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
        <div className="container mx-auto max-w-4xl py-8">
            <div className="bg-white p-2 rounded-md shadow-lg">
                <Image
                  src="https://placehold.co/800x1131.png"
                  alt={`Page du livre ${book.title}`}
                  width={800}
                  height={1131}
                  className="w-full h-auto rounded"
                  data-ai-hint="book page"
                />
            </div>
        </div>
      </main>
    </div>
  );
}
