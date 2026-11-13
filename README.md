# Portfolio de Ny Aina Rakotonirina

Site personnel : développeur fullstack et DevOps, agents IA et automatisation.

En ligne : https://nyaina-ten.vercel.app

## Lancer le projet

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev      # serveur de développement sur http://localhost:3000
npm run build    # build de production dans dist/
npm run preview  # aperçu du build
npm run lint     # vérification TypeScript
```

Le site est statique : n'importe quel hébergeur de fichiers statiques convient (Vercel, Netlify, Nginx).

## Modifier le contenu

Tous les textes et toutes les données sont dans [`src/content.ts`](src/content.ts) :

| Export | Ce qu'il contient |
| --- | --- |
| `identity` | Nom, accroche, e-mail, téléphone, liens, chemin du CV |
| `profile` | Texte de présentation et faits clés |
| `flows` | Les trois workflows animés du haut de page |
| `featuredProjects` | Les projets détaillés, avec leur schéma d'architecture |
| `smallProjects` | Les projets de la liste « Et aussi » |
| `skills` | Les compétences et les projets auxquels chacune est reliée |
| `journey` | Expériences et formations |
| `contact` | Texte de la section contact |

Quelques cas courants :

- **Ajouter le CV** : déposer le PDF dans `public/`, puis renseigner `identity.cv` (par exemple `'/cv-ny-aina-rakotonirina.pdf'`). Le bouton de téléchargement apparaît alors dans le haut de page.
- **Ajouter un projet** : l'ajouter à `featuredProjects` ou `smallProjects`, puis donner son titre court dans `projectTitles` et sa position dans `patchProjects` pour qu'il apparaisse dans le tableau des compétences.
- **Relier une compétence à un projet** : ajouter l'identifiant du projet dans le tableau `projects` de la compétence.
- **Changer de domaine** : mettre à jour les balises `og:url` et `og:image` dans `index.html`.

## Structure

```
src/
├── content.ts            # tout le contenu
├── index.css             # jetons de design (couleurs, typographie) et styles des composants
├── App.tsx               # assemblage de la page, halo du curseur, suivi de la section active
├── lib/hooks.ts          # thème clair/sombre, media queries, mesure d'éléments
└── components/
    ├── Nav.tsx           # navigation, menu mobile, bascule de thème
    ├── Hero.tsx          # nom, accroche, heure locale
    ├── FlowCanvas.tsx    # canevas de workflows : nœuds déplaçables, câbles, exécution simulée
    ├── Skills.tsx        # tableau de brassage compétences ↔ projets
    ├── Projects.tsx      # projets et schémas d'architecture
    ├── Journey.tsx       # frise du parcours
    ├── Contact.tsx       # contact et pied de page
    ├── AxisText.tsx      # titres animés sur les axes variables de la police
    └── Section.tsx       # gabarit de section
```

## Design

- **Idée directrice** : la page est un canevas de workflow. Nœuds, câbles et impulsions reprennent le vocabulaire des outils d'automatisation et des pipelines.
- **Couleurs** : nuit indigo et encre vanille, plus quatre couleurs qui codent chacune un domaine (IA et automatisation, DevOps, développement, réseaux et sécurité). Un thème clair est disponible.
- **Typographie** : Bricolage Grotesque (variable : graisse, largeur, taille optique) pour les titres et le texte, Martian Mono pour le journal d'exécution. Les deux polices sont embarquées, sans appel à un service externe.
- **Accessibilité** : navigation au clavier, contrastes AA dans les deux thèmes, animations désactivées si le système demande un mouvement réduit.

## Technologies

React 19, TypeScript, Vite, Tailwind CSS 4, Motion.
