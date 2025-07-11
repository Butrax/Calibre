# Lecteur Calibre pour Google Drive

Ceci est une application Next.js qui vous permet de parcourir et de lire votre bibliothèque de livres Calibre hébergée sur un dossier public Google Drive.

## Démarrage rapide

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

## Déploiement sur Firebase App Hosting

Ce projet est pré-configuré pour un déploiement facile sur Firebase App Hosting.

1.  **Installez Firebase CLI :**
    Si vous ne l'avez pas, installez l'outil en ligne de commande de Firebase.
    ```bash
    npm install -g firebase-tools
    ```

2.  **Connectez-vous à Firebase :**
    ```bash
    firebase login
    ```

3.  **Initialisez Firebase dans votre projet :**
    (Si vous ne l'avez pas déjà fait)
    ```bash
    firebase init hosting
    ```
    - Sélectionnez `Use an existing project` et choisissez votre projet Firebase.
    - Quand il vous demande `What do you want to use as your public directory?`, entrez `.next`.
    - Configurez comme une "single-page app" (SPA) : `Yes`.
    - Mettez en place les "automatic builds and deploys with GitHub?" : `No`.

4.  **Déployez votre application :**
    ```bash
    npm run build && firebase deploy --only hosting
    ```

Votre application sera en ligne ! C'est généralement beaucoup plus direct que Vercel pour les projets de ce type.
