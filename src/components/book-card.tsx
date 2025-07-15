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
import { Link2, BookOpen } from "lucide-react"
import Link from 'next/link';
import { useState } from 'react';

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  const { toast } = useToast()
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(book.driveLink);
      toast({
        title: "Lien copié !",
        description: "Le lien vers le fichier Google Drive a été copié dans le presse-papiers.",
      });
    }
  }

  const handleContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsContextMenuOpen(true);
  };

  return (
    <DropdownMenu open={isContextMenuOpen} onOpenChange={setIsContextMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Card 
          className="group overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
          onContextMenu={handleContextMenu}
        >
          <Link href={book.pdfUrl} target="_blank" rel="noopener noreferrer" aria-label={`Lire ${book.title}`}>
            <CardContent className="p-0">
                <div className="aspect-[2/3] w-full">
                  <Image
                    src={book.coverUrl}
                    alt={`Couverture de ${book.title}`}
                    width={400}
                    height={600}
                    className="h-full w-full object-cover"
                    data-ai-hint={book.aiHint}
                  />
                </div>
            </CardContent>
          </Link>
          <CardFooter className="p-3">
            <h3 className="font-headline text-sm font-semibold truncate" title={book.title}>
              {book.title}
            </h3>
          </CardFooter>
        </Card>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Lire le livre</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
          <Link2 className="mr-2 h-4 w-4" />
          <span>Copier le lien Drive</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}