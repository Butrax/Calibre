import Image from 'next/image';
import Link from 'next/link';
import type { Book } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/read/${book.id}`} className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
      <Card className="overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="aspect-[2/3] w-full">
            <Image
              src={book.coverUrl}
              alt={`Couverture de ${book.title}`}
              width={400}
              height={600}
              className="h-full w-full object-cover"
              data-ai-hint={book.aiHint}
              unoptimized // Important for local images served from /public
            />
          </div>
        </CardContent>
        <CardFooter className="p-3">
          <h3 className="font-headline text-sm font-semibold truncate" title={book.title}>
            {book.title}
          </h3>
        </CardFooter>
      </Card>
    </Link>
  );
}
