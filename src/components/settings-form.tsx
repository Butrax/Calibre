"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Globe, KeyRound } from "lucide-react"

const formSchema = z.object({
  driveUrl: z.string().url({ message: "Veuillez entrer une URL Google Drive valide." }).refine(
    (url) => url.startsWith("https://drive.google.com/drive/folders/"),
    "L'URL doit commencer par https://drive.google.com/drive/folders/"
  ),
  apiKey: z.string().min(1, { message: "Veuillez entrer une clé API." }),
})

export function SettingsForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      driveUrl: searchParams.get('drive_url') || "",
      apiKey: searchParams.get('api_key') || "",
    },
  })

  useEffect(() => {
    form.reset({
      driveUrl: searchParams.get('drive_url') || "",
      apiKey: searchParams.get('api_key') || "",
    })
  }, [searchParams, form])


  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams()
    params.set("drive_url", values.driveUrl)
    params.set("api_key", values.apiKey)
    router.push(`/?${params.toString()}`)
    
    toast({
      title: "Paramètres enregistrés",
      description: "La bibliothèque va se charger avec les nouvelles informations.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion Google Drive</CardTitle>
        <CardDescription>
          Connectez votre dossier Google Drive public pour synchroniser vos livres.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="driveUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL du dossier Google Drive</FormLabel>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="https://drive.google.com/drive/folders/..." {...field} className="pl-10" />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Copiez-collez ici le lien de partage de votre dossier public.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clé API Google Cloud</FormLabel>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="Entrez votre clé API..." {...field} className="pl-10" type="password" />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Votre clé API est nécessaire pour accéder aux fichiers. <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline">Obtenez une clé ici</a>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Charger la bibliothèque</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
