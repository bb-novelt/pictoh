# Pict'Oh

**Pict'Oh** est une application de communication par pictogrammes conçue pour tablettes en orientation portrait. Elle permet aux utilisateurs de communiquer en sélectionnant des images qui sont lues à voix haute.

## 🎯 Fonctionnalités

- **Grille 6x4** : 24 cases avec coins arrondis pour afficher des pictogrammes
- **Mode édition** : Activé en cliquant 5 fois sur n'importe quelle case
- **Synthèse vocale** : Lecture automatique du texte associé à chaque case
- **Gestion des pages** : Créer, renommer, supprimer et naviguer entre plusieurs pages
- **Personnalisation** : Associer des images, du texte et des liens vers d'autres pages
- **Favoris** : Les images utilisées deviennent automatiquement favorites
- **Persistance** : Toutes les modifications sont sauvegardées automatiquement
- **Orientation portrait** : L'application reste en mode portrait même si la tablette est tournée

## 🚀 Démarrage

### Installation

```bash
npm install
```

### Développement

```bash
npm start
```

L'application sera accessible sur [http://localhost:4200](http://localhost:4200)

### Build de production

```bash
npm run build
```

Les fichiers compilés seront dans `dist/pictho/`

## 📱 Utilisation

### Mode Normal

- Cliquez sur une case pour **lire le texte associé à voix haute**
- Si la case a une page cible, elle sera ouverte après la lecture

### Mode Édition

1. **Activer le mode édition** : Cliquez 5 fois rapidement sur n'importe quelle case
2. **Modifier une case** : Cliquez sur une case pour ouvrir le dialogue d'édition
   - Sélectionner une image
   - Définir le texte associé
   - Choisir si le texte s'affiche au-dessus ou en-dessous
   - Définir une page cible (navigation)
3. **Créer une nouvelle page** : Cliquez sur "+ Créer une page"
4. **Gérer les pages** : Cliquez sur "⚙ Gérer les pages" pour renommer, supprimer ou ouvrir des pages
5. **Quitter le mode édition** : Cliquez sur "✕ Quitter le mode édition"

## 🏗️ Architecture

### Stack technique

- **React 19** avec **TypeScript**
- **Material UI** pour les composants UI
- **Valtio** pour la gestion d'état
- **Tailwind CSS** (utilisé uniquement si nécessaire)
- **Nx** pour la gestion du monorepo
- **Vite** pour le bundling

### Structure du projet

```
src/
├── app/              # Composant principal de l'application
├── components/       # Composants React
│   ├── Grid.tsx
│   ├── Square.tsx
│   ├── EditModeBar.tsx
│   ├── EditSquareModal.tsx
│   ├── CreatePageDialog.tsx
│   └── ManagePagesDialog.tsx
├── state/            # Gestion d'état avec Valtio
│   └── appState.ts
├── types/            # Types TypeScript
│   └── index.ts
└── utils/            # Utilitaires
    ├── pictureLoader.ts
    └── pictureUtils.ts
```

### Modèle de données

```typescript
interface Square {
  id: number;
  selectedPicture?: string;
  associatedText: string;
  displayTextAbovePicture: boolean;
  openPageName: string;
}

interface Page {
  pageName: string;
  squares: Square[]; // 24 squares
}

interface AppConfig {
  homePageName: string;
  pages: Page[];
  pictures: Picture[];
  currentPageName: string;
  isEditMode: boolean;
}
```

## 🎨 Pictogrammes

Les pictogrammes sont stockés dans `public/assets/pictures/` au format SVG.

Pour ajouter de nouvelles images :
1. Placez le fichier SVG dans `public/assets/pictures/`
2. Ajoutez l'entrée correspondante dans `src/utils/pictureLoader.ts`

## 💾 Persistance

Toutes les données sont automatiquement sauvegardées dans le **localStorage** du navigateur :
- Configuration des pages
- Position et contenu des cases
- Favoris
- Page courante

## 🌐 Internationalisation

L'application est actuellement en **français uniquement**, comme spécifié dans les exigences.

## 📝 Licence

MIT

---

**Développé avec ❤️ pour faciliter la communication**
