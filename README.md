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
| `hero` | La note sous le nom (sens de « Aina », jeu de la vie) |
| `sections` | L'ordre des sections et celles qui figurent dans la navigation |
| `demo`, `flows` | Les trois workflows animés de la section « En action » |
| `profile` | Texte de présentation et faits clés |
| `skills` | Les compétences et les projets auxquels chacune est reliée |
| `featuredProjects` | Les projets détaillés : texte, schéma d'architecture, couleur du panneau |
| `smallProjects` | Les projets de la liste « Et aussi » |
| `journey` | Expériences et formations |
| `contact` | Titre et texte du final |

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
├── lib/
│   ├── life.ts           # moteur du jeu de la vie
│   ├── scroll.ts         # défilement fluide (Lenis) et liens d'ancre
│   └── hooks.ts          # thème clair/sombre, media queries, mesure d'éléments
└── components/
    ├── Hero.tsx          # plein écran épinglé : nom géant, accroche, fond vivant
    ├── LifeField.tsx     # rendu du jeu de la vie en matrice de points
    ├── Nav.tsx           # navigation flottante, menu mobile, bascule de thème
    ├── Playground.tsx    # section « En action »
    ├── FlowCanvas.tsx    # canevas de workflows : nœuds déplaçables, câbles, exécution simulée
    ├── Profile.tsx       # présentation, texte qui s'allume au défilement
    ├── Marquee.tsx       # bandeaux de compétences qui suivent la vitesse de défilement
    ├── Skills.tsx        # tableau de brassage compétences ↔ projets
    ├── Projects.tsx      # panneaux de projets empilés, schémas d'architecture, liste « Et aussi »
    ├── Journey.tsx       # frise du parcours
    ├── Contact.tsx       # final orange : adresse, liens, pied de page
    ├── AxisText.tsx      # titres animés sur les axes variables de la police
    ├── ScrubText.tsx     # paragraphe révélé mot à mot
    ├── Magnetic.tsx      # boutons attirés par le curseur
    └── Section.tsx       # gabarit et en-tête de section
```

## Design

- **Signature** : « Aina » signifie « la vie » en malgache. Le fond du hero est un jeu de la vie de Conway : au chargement, le nom s'écrit en cellules vivantes, puis l'automate prend le relais. La souris (ou le doigt) y sème de nouvelles cellules. Le même champ revient dans le final.
- **Mise en scène** : le hero est épinglé et la suite de la page glisse par-dessus comme une feuille. Les projets sont des panneaux de couleur qui s'empilent au défilement. La page se termine sur un aplat orange.
- **Vocabulaire** : nœuds, câbles et impulsions, repris des outils d'automatisation et des pipelines, pour les démonstrations, les compétences et les schémas d'architecture.
- **Couleurs** : nuit indigo et encre vanille, plus quatre couleurs qui codent chacune un domaine (IA et automatisation, DevOps, développement, réseaux et sécurité). Un thème clair est disponible.
- **Typographie** : Bricolage Grotesque (variable : graisse, largeur, taille optique) pour les titres et le texte, Martian Mono pour les repères et le journal d'exécution. Les deux polices sont embarquées, sans appel à un service externe.
- **Accessibilité** : navigation au clavier, contrastes AA dans les deux thèmes, bouton de pause pour le fond animé. Si le système demande un mouvement réduit, les animations sont coupées, le fond est figé et le défilement redevient natif.

## Technologies

React 19, TypeScript, Vite, Tailwind CSS 4, Motion, Lenis.
