# Lecteur Calibre pour Google Drive

Ceci est une application Next.js qui vous permet de parcourir et de lire votre bibliothèque de livres Calibre hébergée sur un dossier public Google Drive.

## Démarrage rapide (Développement local)

Pour lancer l'application en mode développement local :

```bash
npm run dev
```

Ouvrez [http://localhost:9002](http://localhost:9002) dans votre navigateur.

## Configuration

1.  Rendez-vous sur la page **Paramètres** de l'application (icône d'engrenage).
2.  Entrez l'URL de votre dossier Google Drive public contenant vos livres. Le dossier doit être partagé "à tous les utilisateurs disposant du lien".
3.  Entrez une clé API Google Cloud. Assurez-vous que l'**API Google Drive est activée** pour votre projet sur la [console Google Cloud](https://console.cloud.google.com/apis/library/drive.googleapis.com).

L'application chargera et affichera les livres de votre dossier.

## Déploiement (Mise en ligne)

Ce projet est pré-configuré pour un déploiement facile et rapide sur **Firebase App Hosting**.

La manière la plus simple de déployer votre application est d'utiliser le bouton **"Publish"** en haut à droite de votre interface de développement.

Un clic sur ce bouton va automatiquement :
1.  Compiler votre application pour la production.
2.  La déployer sur Firebase App Hosting.

Votre application sera en ligne en quelques instants ! C'est généralement beaucoup plus direct que d'autres plateformes pour les projets de ce type. Pour un usage personnel, le service restera très probablement dans les limites du généreux **niveau gratuit** de Firebase.
