"use client"

import Image from 'next/image';
import type { Book } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Link2, BookOpen, MoreVertical } from "lucide-react"
import { Button } from '@/components/ui/button';

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  const { toast } = useToast()

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(book.driveLink);
      toast({
        title: "Lien copié !",
        description: "Le lien vers le fichier Google Drive a été copié dans le presse-papiers.",
      });
    }
  }

  const handleBookClick = () => {
    window.open(book.pdfUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="group overflow-hidden flex flex-col">
      <CardContent className="p-0 cursor-pointer" onClick={handleBookClick}>
          <div className="aspect-[2/3] w-full">
            <Image
              src={book.coverUrl}
              alt={`Couverture de ${book.title}`}
              width={400}
              height={600}
              className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              data-ai-hint={book.aiHint}
              priority
            />
          </div>
      </CardContent>
      <CardFooter className="p-2 flex items-start mt-auto">
        <div className="flex-grow">
          <h3 className="font-headline text-sm font-semibold truncate" title={book.title}>
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground truncate" title={book.author}>{book.author}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
               <MoreVertical className="h-4 w-4" />
               <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Télécharger le livre</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
              <Link2 className="mr-2 h-4 w-4" />
              <span>Copier le lien Drive</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
