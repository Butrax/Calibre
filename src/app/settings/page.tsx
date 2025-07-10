import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsForm } from '@/components/settings-form';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 bg-background/80 backdrop-blur-sm border-b md:px-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/" aria-label="Retour à la bibliothèque">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="font-headline text-xl font-semibold ml-4">Paramètres</h1>
      </header>
      <main className="px-4 py-8 md:px-6 md:py-12">
        <div className="max-w-2xl mx-auto">
          <SettingsForm />
        </div>
      </main>
    </div>
  );
}
