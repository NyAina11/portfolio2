/**
 * Tout le contenu du portfolio est ici.
 * Modifier un texte, ajouter un projet ou une compétence se fait dans ce fichier,
 * sans toucher aux composants.
 */

export type Domain = 'ia' | 'ops' | 'dev' | 'net';

export const domains: Record<Domain, { label: string; short: string }> = {
  ia: { label: 'IA et automatisation', short: 'IA' },
  ops: { label: 'DevOps et infrastructure', short: 'DevOps' },
  dev: { label: 'Développement', short: 'Dev' },
  net: { label: 'Réseaux et sécurité', short: 'Réseaux' },
};

/* ------------------------------------------------------------------ */
/* Identité                                                            */
/* ------------------------------------------------------------------ */

export const identity = {
  firstName: 'Ny Aina',
  lastName: 'Rakotonirina',
  role: 'Développeur fullstack et DevOps',
  pitch:
    'Je construis des applications, je les automatise avec des agents IA et je les mets en production avec Docker, CI/CD et Kubernetes.',
  availability: 'Disponible pour des missions freelance',
  location: 'Madagascar',
  timeZone: 'Indian/Antananarivo',
  email: 'rakotonirinanyaina11@gmail.com',
  phone: '+261 34 56 037 11',
  phoneHref: 'tel:+261345603711',
  github: 'https://github.com/NyAina11',
  linkedin: 'https://linkedin.com/in/ny-aina-rak',
  /** Déposer le PDF dans /public puis renseigner son chemin, par exemple '/cv-ny-aina-rakotonirina.pdf'. */
  cv: null as string | null,
};

/** Texte du hero, sous le nom. */
export const hero = {
  note: 'Aina signifie « la vie » en malgache. Ce fond est un jeu de la vie : chaque point naît, vit et meurt selon ses voisins.',
  noteMouse: 'Déplacez la souris pour en semer.',
  noteTouch: 'Touchez l’écran pour en semer.',
};

/** Sections de la page, dans l'ordre. Celles marquées `nav` apparaissent dans la navigation. */
export const sections = [
  { id: 'demo', label: 'En action', nav: false },
  { id: 'profil', label: 'Profil', nav: true },
  { id: 'competences', label: 'Compétences', nav: true },
  { id: 'projets', label: 'Projets', nav: true },
  { id: 'parcours', label: 'Parcours', nav: true },
  { id: 'contact', label: 'Contact', nav: false },
] as const;

export type SectionId = (typeof sections)[number]['id'];

export const demo = {
  title: 'En action',
  intro:
    'Trois systèmes que j’ai construits, rejoués dans votre navigateur. Choisissez-en un, lancez-le, déplacez ses nœuds.',
};

/* ------------------------------------------------------------------ */
/* Profil                                                              */
/* ------------------------------------------------------------------ */

export const profile = {
  lead: 'Développeur fullstack, formé à l’administration système et réseau. Ce qui m’intéresse, c’est la chaîne entière : écrire l’application, automatiser ce qui se répète, puis la faire tourner proprement en production.',
  paragraphs: [
    'En freelance depuis 2025, je conçois des agents IA et des workflows n8n qui travaillent sans intervention manuelle, ainsi que des interfaces branchées sur des API tierces. Côté infrastructure, je conteneurise avec Docker, j’écris les pipelines CI/CD et je déploie sur VPS ou sur Kubernetes.',
    'Ma formation en systèmes, réseaux et ethical hacking m’a laissé un réflexe : penser à la sécurité et à l’exploitation dès la conception, pas après la mise en ligne.',
  ],
  facts: [
    { term: 'Basé à', value: 'Madagascar, UTC+3' },
    { term: 'Statut', value: 'Freelance, ouvert aux missions et aux postes DevOps ou IA' },
    { term: 'Formation', value: 'Licence 3 en administration système et réseau, ENI Fianarantsoa' },
  ],
};

/* ------------------------------------------------------------------ */
/* Workflows de démonstration (hero)                                   */
/* ------------------------------------------------------------------ */

export type FlowIcon =
  | 'send' | 'bot' | 'brain' | 'mail' | 'check'
  | 'phone' | 'server' | 'boxes' | 'shield' | 'globe'
  | 'git' | 'folder' | 'flask' | 'package' | 'rocket' | 'activity';

export interface FlowNode {
  id: string;
  label: string;
  sub: string;
  icon: FlowIcon;
  domain: Domain;
  /** Position logique : colonne (sens du flux) et rangée (0 = chaîne principale). */
  col: number;
  row: number;
}

export interface FlowStep {
  node: string;
  log: string;
  /** Arêtes parcourues avant l'exécution du nœud (index dans `edges`). */
  via?: number[];
  /** Arêtes déclenchées après l'exécution, sans bloquer la suite. */
  emit?: number[];
  ms?: number;
}

export interface Flow {
  id: string;
  tab: string;
  title: string;
  projectId: string;
  nodes: FlowNode[];
  edges: [from: string, to: string][];
  steps: FlowStep[];
  outcome: string;
}

export const flows: Flow[] = [
  {
    id: 'agent',
    tab: 'Agent Telegram',
    title: 'Un client pilote ses e-mails depuis Telegram',
    projectId: 'automatisations',
    nodes: [
      { id: 'tg', label: 'Telegram', sub: 'Message entrant', icon: 'send', domain: 'ia', col: 0, row: 0 },
      { id: 'agent', label: 'Agent IA', sub: 'Workflow n8n', icon: 'bot', domain: 'ia', col: 1, row: 0 },
      { id: 'llm', label: 'LLM', sub: 'Modèle local', icon: 'brain', domain: 'ia', col: 1, row: 1 },
      { id: 'mail', label: 'API mail', sub: 'Rédaction et envoi', icon: 'mail', domain: 'dev', col: 2, row: 0 },
      { id: 'reply', label: 'Réponse', sub: 'Confirmation au client', icon: 'check', domain: 'ia', col: 3, row: 0 },
    ],
    edges: [
      ['tg', 'agent'],
      ['agent', 'llm'],
      ['agent', 'mail'],
      ['mail', 'reply'],
    ],
    steps: [
      { node: 'tg', log: 'Message reçu : « Envoie le compte rendu à l’équipe »' },
      { node: 'agent', via: [0], log: 'Workflow déclenché par webhook' },
      { node: 'llm', via: [1], log: 'Intention comprise : rédiger puis envoyer un e-mail', ms: 900 },
      { node: 'mail', via: [2], log: 'E-mail rédigé et envoyé via l’API' },
      { node: 'reply', via: [3], log: 'Confirmation renvoyée dans Telegram' },
    ],
    outcome: 'Aucune intervention manuelle',
  },
  {
    id: 'k3s',
    tab: 'Kubernetes',
    title: 'Un service déployé sur Kubernetes depuis un téléphone',
    projectId: 'k3s-mobile',
    nodes: [
      { id: 'app', label: 'App mobile', sub: 'React Native', icon: 'phone', domain: 'dev', col: 0, row: 0 },
      { id: 'api', label: 'API', sub: 'FastAPI et JWT', icon: 'server', domain: 'dev', col: 1, row: 0 },
      { id: 'k3s', label: 'Cluster k3s', sub: 'Deployment, Ingress', icon: 'boxes', domain: 'ops', col: 2, row: 0 },
      { id: 'cert', label: 'cert-manager', sub: 'Certificat TLS', icon: 'shield', domain: 'net', col: 2, row: 1 },
      { id: 'https', label: 'Service en ligne', sub: 'HTTPS via Traefik', icon: 'globe', domain: 'ops', col: 3, row: 0 },
    ],
    edges: [
      ['app', 'api'],
      ['api', 'k3s'],
      ['k3s', 'cert'],
      ['k3s', 'https'],
      ['cert', 'https'],
    ],
    steps: [
      { node: 'app', log: 'Demande de déploiement : image nginx, 2 réplicas, SSL activé' },
      { node: 'api', via: [0], log: 'Jeton JWT vérifié, appel à l’API Kubernetes' },
      { node: 'k3s', via: [1], log: 'Deployment, Service et Ingress créés : 2/2 pods prêts', ms: 900 },
      { node: 'cert', via: [2], log: 'Certificat TLS émis automatiquement (ACME)' },
      { node: 'https', via: [3, 4], log: 'Service exposé en HTTPS par Traefik' },
    ],
    outcome: 'Aucune commande kubectl',
  },
  {
    id: 'cicd',
    tab: 'CI/CD',
    title: 'Un commit testé, construit et déployé sous vos yeux',
    projectId: 'cicd',
    nodes: [
      { id: 'push', label: 'git push', sub: 'Nouveau commit', icon: 'git', domain: 'dev', col: 0, row: 0 },
      { id: 'clone', label: 'Clone', sub: 'Workspace isolé', icon: 'folder', domain: 'ops', col: 1, row: 0 },
      { id: 'test', label: 'Tests', sub: 'npm test', icon: 'flask', domain: 'ops', col: 2, row: 0 },
      { id: 'build', label: 'Build', sub: 'npm run build', icon: 'package', domain: 'ops', col: 3, row: 0 },
      { id: 'deploy', label: 'Déploiement', sub: 'Mise en ligne', icon: 'rocket', domain: 'ops', col: 4, row: 0 },
      { id: 'dash', label: 'Dashboard', sub: 'Logs en direct', icon: 'activity', domain: 'dev', col: 2.5, row: 1 },
    ],
    edges: [
      ['push', 'clone'],
      ['clone', 'test'],
      ['test', 'build'],
      ['build', 'deploy'],
      ['test', 'dash'],
      ['build', 'dash'],
    ],
    steps: [
      { node: 'push', log: 'Nouveau commit détecté sur main' },
      { node: 'clone', via: [0], log: 'Dépôt cloné dans un workspace isolé' },
      { node: 'test', via: [1], emit: [4], log: 'Tests passés', ms: 800 },
      { node: 'build', via: [2], emit: [5], log: 'Build terminé', ms: 800 },
      { node: 'deploy', via: [3], log: 'Application déployée' },
      { node: 'dash', log: 'Logs diffusés en direct, exécution archivée', ms: 400 },
    ],
    outcome: 'Arrêt automatique à la première erreur',
  },
];

/* ------------------------------------------------------------------ */
/* Projets                                                             */
/* ------------------------------------------------------------------ */

export interface ProjectLink {
  label: string;
  href: string;
  kind: 'code' | 'live';
}

export interface StackLayer {
  label: string;
  tech: string;
  domain: Domain;
  /** Protocole ou lien vers la couche suivante. */
  link?: string;
}

export interface FeaturedProject {
  id: string;
  title: string;
  context: string;
  summary: string;
  points: string[];
  stack: string[];
  links: ProjectLink[];
  layers: StackLayer[];
  /** Ce qui enveloppe la stack (hébergement, orchestration). */
  wrap?: string;
  /** Couleur du panneau. */
  pop: 'teal' | 'lilac' | 'yellow' | 'orange' | 'cream';
}

export interface SmallProject {
  id: string;
  title: string;
  context: string;
  summary: string;
  stack: string[];
  links: ProjectLink[];
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: 'k3s-mobile',
    pop: 'teal',
    title: 'Déployer sur Kubernetes depuis son téléphone',
    context: '2026, projet de Licence 3 à l’ENI Fianarantsoa',
    summary:
      'Une application mobile qui permet à un administrateur de déployer, surveiller et supprimer des services sur un cluster k3s sans taper une commande. Chaque service exposé reçoit son certificat TLS automatiquement.',
    points: [
      'API FastAPI qui traduit chaque action de l’app en ressources Kubernetes : Deployment, Service, Ingress',
      'Logs des pods et événements du cluster diffusés en direct par WebSocket',
      'HTTPS automatique avec Traefik, cert-manager et Let’s Encrypt',
      'Authentification JWT, mots de passe hachés avec bcrypt et droits RBAC limités au strict nécessaire',
    ],
    stack: ['React Native', 'Expo', 'TypeScript', 'FastAPI', 'k3s', 'Traefik', 'cert-manager'],
    links: [{ label: 'Code sur GitHub', href: 'https://github.com/NyAina11/app-mob-k3s', kind: 'code' }],
    layers: [
      { label: 'App mobile', tech: 'React Native, Expo', domain: 'dev', link: 'REST et WebSocket' },
      { label: 'API', tech: 'FastAPI, JWT', domain: 'dev', link: 'API Kubernetes' },
      { label: 'Cluster k3s', tech: 'Traefik, cert-manager', domain: 'ops', link: 'ACME' },
      { label: 'Let’s Encrypt', tech: 'Certificats TLS', domain: 'net' },
    ],
  },
  {
    id: 'cicd',
    pop: 'lilac',
    title: 'Une plateforme CI/CD qui montre ce qu’elle fait',
    context: '2026, projet DevOps',
    summary:
      'Une mini-plateforme qui exécute un vrai pipeline (clone, installation, tests, build, déploiement) et l’affiche en direct : chaque étape est un nœud, chaque ligne de log arrive en temps réel.',
    points: [
      'Moteur d’exécution Node.js : chaque étape tourne dans un workspace isolé, le pipeline s’arrête à la première erreur',
      'Logs diffusés ligne par ligne avec Socket.IO, puis archivés par exécution',
      'Déclenchement automatique à chaque nouveau commit sur les dépôts surveillés',
      'Historique persistant des déploiements, avec le détail de chaque étape',
    ],
    stack: ['Node.js', 'Express', 'Socket.IO', 'React', 'Vite'],
    links: [{ label: 'Code sur GitHub', href: 'https://github.com/NyAina11/CI-CD-project', kind: 'code' }],
    layers: [
      { label: 'Dashboard', tech: 'React, Vite', domain: 'dev', link: 'REST et Socket.IO' },
      { label: 'API', tech: 'Node.js, Express', domain: 'dev', link: 'Processus enfants' },
      { label: 'Exécuteur de pipeline', tech: 'git, npm, étapes configurables', domain: 'ops', link: 'Polling' },
      { label: 'GitHub', tech: 'Dépôts surveillés', domain: 'ops' },
    ],
  },
  {
    id: 'ascf',
    pop: 'yellow',
    title: 'ASCF, le suivi des contributions fiscales',
    context: '2025, stage de trois mois au Service Régional des Entreprises',
    summary:
      'Une application interne qui suit chaque dossier de paiement, de l’accueil du contribuable jusqu’à l’encaissement. Conçue, développée et conteneurisée pendant mon stage.',
    points: [
      'Quatre rôles (Accueil, Gestion, Caisse, Chef de division), chacun avec ses permissions',
      'Suivi des dossiers par statut, enregistrement des paiements et journal d’audit',
      'Tableaux de bord et exports PDF et Excel',
      'Pipeline GitHub Actions : tests sur PostgreSQL, puis build des images Docker',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Docker Compose', 'GitHub Actions'],
    links: [{ label: 'Code sur GitHub', href: 'https://github.com/NyAina11/Stage-Impot', kind: 'code' }],
    layers: [
      { label: 'Interface', tech: 'React, TypeScript, Nginx', domain: 'dev', link: 'REST et JWT' },
      { label: 'API', tech: 'Node.js, Express', domain: 'dev', link: 'SQL' },
      { label: 'Base de données', tech: 'PostgreSQL', domain: 'dev' },
    ],
    wrap: 'Docker Compose, testé par GitHub Actions',
  },
  {
    id: 'automatisations',
    pop: 'orange',
    title: 'Des agents IA qui travaillent sans moi',
    context: 'Depuis 2025, missions freelance',
    summary:
      'Des workflows livrés à des clients et qui tournent seuls : un chatbot Telegram relié à une API mail, de la veille web automatisée, des agents branchés sur des modèles de langage hébergés localement.',
    points: [
      'Chatbot Telegram connecté à une API mail pour un client : plus aucune intervention manuelle',
      'Scraping et veille avec SerpAPI, intégrés dans des workflows n8n en production',
      'Stack auto-hébergée avec Docker Compose : n8n, LLM embarqué, reverse proxy et exposition par Ngrok',
    ],
    stack: ['n8n', 'Make', 'LLM locaux', 'Webhooks', 'SerpAPI', 'Docker Compose', 'Ngrok'],
    links: [],
    layers: [
      { label: 'Déclencheurs', tech: 'Telegram, webhooks, SerpAPI', domain: 'ia', link: 'Événements' },
      { label: 'Orchestration', tech: 'n8n, Make', domain: 'ia', link: 'Prompts' },
      { label: 'Agent IA', tech: 'LLM local', domain: 'ia', link: 'REST' },
      { label: 'Actions', tech: 'API mail, outils du client', domain: 'dev' },
    ],
    wrap: 'Docker Compose, reverse proxy, Ngrok',
  },
  {
    id: 'processiq',
    pop: 'cream',
    title: 'ProcessIQ, l’ERP d’une école',
    context: '2026, projet en équipe',
    summary:
      'Un tableau de bord qui réunit les portails Commercial, Admissions, RH et Étudiant d’une école, avec génération de documents et signature électronique. J’ai travaillé sur le front et pris en charge le déploiement.',
    points: [
      'Front React et TypeScript, avec un accès filtré selon le rôle de l’utilisateur',
      'Intégrations Airtable, MongoDB et DocuSign',
      'Mise en production sur VPS : Docker Compose, Nginx en reverse proxy, HTTPS avec Certbot et health checks',
    ],
    stack: ['React', 'TypeScript', 'Zustand', 'Docker Compose', 'Nginx', 'Certbot', 'VPS'],
    links: [
      { label: 'Front sur GitHub', href: 'https://github.com/NyAina11/process-IQ-rush-school', kind: 'code' },
      { label: 'Déploiement sur GitHub', href: 'https://github.com/NyAina11/processiq', kind: 'code' },
    ],
    layers: [
      { label: 'Nginx', tech: 'Reverse proxy, HTTPS avec Certbot', domain: 'ops', link: 'Fichiers statiques et /api' },
      { label: 'Portails', tech: 'React, TypeScript, Zustand', domain: 'dev', link: 'REST et JWT' },
      { label: 'API', tech: 'Node.js, Express', domain: 'dev', link: 'SDK et requêtes' },
      { label: 'Données et services', tech: 'MongoDB, Airtable, DocuSign', domain: 'dev' },
    ],
    wrap: 'VPS, Docker Compose',
  },
];

export const smallProjects: SmallProject[] = [
  {
    id: 'cv-forge',
    title: 'CV Forge AI',
    context: '2026',
    summary:
      'Un générateur de CV assisté par Gemini : l’IA aide à rédiger et propose des mises en page à partir d’une description. Le rendu A4 à l’écran est identique au PDF exporté, et la clé d’API reste côté serveur.',
    stack: ['React', 'TypeScript', 'API Gemini', 'Vercel'],
    links: [
      { label: 'Voir en ligne', href: 'https://generateur-de-cv-vert.vercel.app', kind: 'live' },
      { label: 'Code', href: 'https://github.com/NyAina11/Generateur-de-CV', kind: 'code' },
    ],
  },
  {
    id: 'audit-wifi',
    title: 'Framework d’audit WiFi',
    context: '2025',
    summary:
      'Un outil Python pour auditer un réseau WiFi avec autorisation : scan, analyse des protocoles de WEP à WPA3, détection de faux points d’accès et de failles WPS, puis rapport HTML avec un score de sécurité.',
    stack: ['Python', 'Scapy', 'Linux'],
    links: [{ label: 'Code', href: 'https://github.com/NyAina11/pentest_framework', kind: 'code' }],
  },
  {
    id: 'go-travel',
    title: 'Go Travel, circuits à Madagascar',
    context: '2026',
    summary:
      'Le site vitrine en anglais d’une agence de voyage : présentation des circuits, une page par itinéraire et une page de liens rapides, le tout déployé sur Vercel.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
    links: [
      { label: 'Voir en ligne', href: 'https://go-travel-circuit.vercel.app', kind: 'live' },
      { label: 'Code', href: 'https://github.com/NyAina11/go-travel---circuit-of-madagascar', kind: 'code' },
    ],
  },
  {
    id: 'infra-web',
    title: 'Infrastructure web complète sous Linux',
    context: 'Projet académique',
    summary:
      'Le déploiement d’un serveur de bout en bout sous GNU/Linux : stack web LAMP puis LEMP, serveur de messagerie et zone DNS.',
    stack: ['GNU/Linux', 'Apache', 'Nginx', 'DNS', 'Mail'],
    links: [],
  },
  {
    id: 'transfert-cpp',
    title: 'Transfert de fichiers en C++',
    context: 'Projet académique',
    summary:
      'Une application de transfert de fichiers écrite au niveau des sockets réseau, avec plusieurs transferts menés en parallèle grâce au multithreading.',
    stack: ['C++', 'Sockets', 'Multithreading'],
    links: [],
  },
  {
    id: 'reseau-gns3',
    title: 'Architecture réseau simulée',
    context: 'Projet académique',
    summary:
      'La simulation d’une architecture réseau sur GNS3 : routage dynamique en RIPv2 et OSPF, puis analyse des trames échangées.',
    stack: ['GNS3', 'OSPF', 'RIPv2'],
    links: [],
  },
];

export const projectTitles: Record<string, string> = {
  automatisations: 'Agents IA et workflows n8n',
  'cv-forge': 'CV Forge AI',
  'k3s-mobile': 'Kubernetes depuis mobile',
  cicd: 'Plateforme CI/CD',
  processiq: 'ProcessIQ',
  ascf: 'ASCF, suivi fiscal',
  'go-travel': 'Go Travel',
  'transfert-cpp': 'Transfert de fichiers C++',
  'infra-web': 'Infrastructure web Linux',
  'reseau-gns3': 'Réseau simulé GNS3',
  'audit-wifi': 'Audit WiFi',
};

/** Ordre d'affichage des projets dans le tableau de brassage des compétences. */
export const patchProjects = [
  'automatisations',
  'cv-forge',
  'k3s-mobile',
  'cicd',
  'processiq',
  'ascf',
  'go-travel',
  'transfert-cpp',
  'infra-web',
  'reseau-gns3',
  'audit-wifi',
];

/* ------------------------------------------------------------------ */
/* Compétences                                                         */
/* ------------------------------------------------------------------ */

export interface Skill {
  id: string;
  label: string;
  domain: Domain;
  /** Projets dans lesquels la compétence est mise en œuvre. */
  projects: string[];
}

export const skills: Skill[] = [
  // IA et automatisation
  { id: 'n8n', label: 'n8n', domain: 'ia', projects: ['automatisations'] },
  { id: 'make', label: 'Make', domain: 'ia', projects: ['automatisations'] },
  { id: 'agents', label: 'Agents IA et LLM locaux', domain: 'ia', projects: ['automatisations'] },
  { id: 'gemini', label: 'API Gemini', domain: 'ia', projects: ['cv-forge', 'processiq'] },
  { id: 'webhooks', label: 'API REST et webhooks', domain: 'ia', projects: ['automatisations', 'k3s-mobile', 'processiq'] },

  // DevOps et infrastructure
  { id: 'docker', label: 'Docker et Compose', domain: 'ops', projects: ['automatisations', 'k3s-mobile', 'processiq', 'ascf'] },
  { id: 'k8s', label: 'Kubernetes (k3s)', domain: 'ops', projects: ['k3s-mobile'] },
  { id: 'actions', label: 'GitHub Actions', domain: 'ops', projects: ['ascf'] },
  { id: 'proxy', label: 'Nginx et Traefik', domain: 'ops', projects: ['k3s-mobile', 'processiq', 'ascf', 'infra-web'] },
  { id: 'tls', label: 'Certificats TLS automatisés', domain: 'ops', projects: ['k3s-mobile', 'processiq'] },
  { id: 'linux', label: 'Linux et Bash', domain: 'ops', projects: ['processiq', 'infra-web', 'audit-wifi'] },

  // Développement
  { id: 'ts', label: 'TypeScript et JavaScript', domain: 'dev', projects: ['cv-forge', 'k3s-mobile', 'cicd', 'processiq', 'ascf', 'go-travel'] },
  { id: 'react', label: 'React', domain: 'dev', projects: ['cv-forge', 'cicd', 'processiq', 'ascf'] },
  { id: 'rn', label: 'React Native (Expo)', domain: 'dev', projects: ['k3s-mobile'] },
  { id: 'node', label: 'Node.js et Express', domain: 'dev', projects: ['cicd', 'ascf'] },
  { id: 'python', label: 'Python (FastAPI, Django)', domain: 'dev', projects: ['k3s-mobile', 'audit-wifi'] },
  { id: 'db', label: 'PostgreSQL et MongoDB', domain: 'dev', projects: ['processiq', 'ascf'] },
  { id: 'langs', label: 'C++, PHP et Java', domain: 'dev', projects: ['transfert-cpp', 'infra-web'] },

  // Réseaux et sécurité
  { id: 'sockets', label: 'Sockets et WebSocket', domain: 'net', projects: ['k3s-mobile', 'cicd', 'transfert-cpp'] },
  { id: 'auth', label: 'JWT et contrôle d’accès', domain: 'net', projects: ['k3s-mobile', 'processiq', 'ascf'] },
  { id: 'dns', label: 'DNS et messagerie', domain: 'net', projects: ['infra-web'] },
  { id: 'routing', label: 'Routage OSPF et RIPv2', domain: 'net', projects: ['reseau-gns3'] },
  { id: 'pentest', label: 'Pentest et ethical hacking', domain: 'net', projects: ['audit-wifi'] },
];

/* ------------------------------------------------------------------ */
/* Parcours                                                            */
/* ------------------------------------------------------------------ */

export interface JourneyItem {
  id: string;
  kind: 'experience' | 'formation';
  period: string;
  title: string;
  place: string;
  points?: string[];
}

export const journey: JourneyItem[] = [
  {
    id: 'l3',
    kind: 'formation',
    period: '2026',
    title: 'Licence 3 en informatique, administration système et réseau',
    place: 'ENI Fianarantsoa',
  },
  {
    id: 'freelance',
    kind: 'experience',
    period: '2025 à aujourd’hui',
    title: 'Développeur agents IA et front-end',
    place: 'Freelance, missions indépendantes',
    points: [
      'Agents IA et workflows n8n qui automatisent des processus métier, avec des LLM hébergés localement',
      'Front-ends connectés à des API tierces : REST, webhooks et intégrations temps réel',
      'Pipelines CI/CD légers avec GitHub Actions et conteneurisation Docker',
    ],
  },
  {
    id: 'stage',
    kind: 'experience',
    period: '2025, trois mois',
    title: 'Développeur fullstack et DevOps',
    place: 'Stage au Service Régional des Entreprises',
    points: [
      'Application complète de gestion et de suivi des dossiers, du backend à l’interface',
      'Pipeline CI/CD avec GitHub Actions : tests automatisés, build et déploiement continu',
      'Conteneurisation de toute la stack pour garantir des environnements identiques',
    ],
  },
  {
    id: 'hacking',
    kind: 'formation',
    period: 'Novembre 2024',
    title: 'Formation en ethical hacking',
    place: 'ESTI Antananarivo',
  },
  {
    id: 'bac',
    kind: 'formation',
    period: '2023',
    title: 'Baccalauréat série C',
    place: 'SFX Ambatomena',
  },
];

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const contact = {
  title: 'Une idée à mettre en production ?',
  text: 'Écrivez-moi quelques lignes sur votre besoin : ce qui existe déjà, ce qui vous fait perdre du temps, et où vous voulez arriver.',
};
