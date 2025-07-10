"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Globe } from "lucide-react"

const formSchema = z.object({
  driveUrl: z.string().url({ message: "Veuillez entrer une URL valide." }),
})

export function SettingsForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      driveUrl: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "Paramètres enregistrés",
      description: "L'URL de votre Google Drive a été sauvegardée.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion Google Drive</CardTitle>
        <CardDescription>
          Connectez votre dossier Google Drive pour synchroniser vos livres.
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
                    Copiez-collez ici le lien de partage de votre dossier.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Enregistrer</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
