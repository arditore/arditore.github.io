export const languages = { en: 'English', fr: 'Français' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'site.title': 'Arditore',
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.cv': 'CV',
    'nav.blog': 'Blog',
    'nav.skip': 'Skip to content',
    'nav.label': 'Main',
    'theme.toggle': 'Switch between polar day and polar night',
    'lang.switch': 'Lire en français',
    'lang.label': 'Français',

    'hero.role': 'Full-stack developer specialised in digital forensics',
    'hero.tagline': 'An iceberg shows a tenth of itself. Forensics is the rest.',
    'hero.intro':
      'I work from low-level systems up to polished interfaces, and I care about minimal dependencies, reproducible builds and privacy-respecting architecture.',
    'hero.portrait': 'Portrait of Arditore',

    'waterline.label': 'Below the waterline',

    'stack.title': 'Stack',
    'stack.languages': 'Languages',
    'stack.frontend': 'Frontend',
    'stack.backend': 'Backend & Infrastructure',

    'projects.title': 'Projects',
    'projects.next': 'More on the way',
    'projects.next.body': 'Current interests, and what the next repositories will look like:',
    'projects.next.1': 'Forensic tooling and artefact parsing',
    'projects.next.2': 'Systems work in Rust',
    'projects.next.3': 'Self-hosted, dependency-light web services',
    'projects.next.4': 'Anything that removes a tracker from a phone',
    'projects.open': 'Open repository',
    'projects.read': 'Read about',
    'projects.all': 'All projects',
    'projects.updated': 'Updated',

    'status.active': 'Active',
    'status.wip': 'In progress',
    'status.archived': 'Archived',

    'contact.title': 'Contact',
    'contact.body': 'One address. No form, no tracking, no middleman.',

    'cv.title': 'CV',
    'cv.subtitle': 'What I do, and on what terms.',
    'cv.terms': 'Terms of engagement',
    'cv.p2p':
      'Peer-to-peer work only — individual to individual. No professional engagements, no company work, and I am not looking for a job.',
    'cv.skills': 'Skills',
    'cv.privacy': 'This page carries no personal history by design. Skills and terms, nothing else.',

    'blog.title': 'Writing',
    'blog.empty': 'Nothing published yet.',
    'blog.rss': 'RSS feed',
    'blog.published': 'Published',
    'blog.toc': 'Contents',
    'blog.article': 'article',
    'blog.articles': 'articles',
    'blog.readingTime': 'min read',
    'blog.back': 'All writing',

    'notfound.title': 'Off the map',
    'notfound.body': 'This page is below the waterline and out of reach.',
    'notfound.back': 'Back to the surface',

    'untranslated': 'This page is not translated yet — showing the English version.',
    'footer.built': 'Built in the open. No trackers, no cookies, no third-party requests.',
    'footer.source': 'Source',
  },
  fr: {
    'site.title': 'Arditore',
    'nav.home': 'Accueil',
    'nav.projects': 'Projets',
    'nav.cv': 'CV',
    'nav.blog': 'Blog',
    'nav.skip': 'Aller au contenu',
    'nav.label': 'Principale',
    'theme.toggle': 'Basculer entre jour polaire et nuit polaire',
    'lang.switch': 'Read in English',
    'lang.label': 'English',

    'hero.role': 'Développeur full-stack spécialisé en investigation numérique',
    'hero.tagline': 'Un iceberg ne montre qu’un dixième de lui-même. L’investigation, c’est le reste.',
    'hero.intro':
      'Je travaille des systèmes bas niveau jusqu’aux interfaces soignées, avec le souci constant de dépendances minimales, de builds reproductibles et d’une architecture qui respecte la vie privée.',
    'hero.portrait': 'Portrait d’Arditore',

    'waterline.label': 'Sous la ligne de flottaison',

    'stack.title': 'Stack',
    'stack.languages': 'Langages',
    'stack.frontend': 'Frontend',
    'stack.backend': 'Backend et infrastructure',

    'projects.title': 'Projets',
    'projects.next': 'Ce qui arrive',
    'projects.next.body': 'Centres d’intérêt actuels, et ce à quoi ressembleront les prochains dépôts :',
    'projects.next.1': 'Outillage forensique et analyse d’artefacts',
    'projects.next.2': 'Travail système en Rust',
    'projects.next.3': 'Services web auto-hébergés et légers en dépendances',
    'projects.next.4': 'Tout ce qui retire un traceur d’un téléphone',
    'projects.open': 'Ouvrir le dépôt',
    'projects.read': 'Découvrir',
    'projects.all': 'Tous les projets',
    'projects.updated': 'Mis à jour',

    'status.active': 'Actif',
    'status.wip': 'En cours',
    'status.archived': 'Archivé',

    'contact.title': 'Contact',
    'contact.body': 'Une adresse. Aucun formulaire, aucun pistage, aucun intermédiaire.',

    'cv.title': 'CV',
    'cv.subtitle': 'Ce que je fais, et à quelles conditions.',
    'cv.terms': 'Conditions d’intervention',
    'cv.p2p':
      'Missions de particulier à particulier uniquement. Aucune prestation professionnelle, aucune mission pour une entreprise, et je ne cherche pas d’emploi.',
    'cv.skills': 'Compétences',
    'cv.privacy':
      'Cette page ne comporte aucun parcours personnel, volontairement. Des compétences et des conditions, rien d’autre.',

    'blog.title': 'Écrits',
    'blog.empty': 'Rien de publié pour l’instant.',
    'blog.rss': 'Flux RSS',
    'blog.published': 'Publié le',
    'blog.toc': 'Sommaire',
    'blog.article': 'article',
    'blog.articles': 'articles',
    'blog.readingTime': 'min de lecture',
    'blog.back': 'Tous les écrits',

    'notfound.title': 'Hors carte',
    'notfound.body': 'Cette page est sous la ligne de flottaison, hors de portée.',
    'notfound.back': 'Remonter à la surface',

    'untranslated': 'Cette page n’est pas encore traduite — version anglaise affichée.',
    'footer.built': 'Construit à découvert. Aucun traceur, aucun cookie, aucune requête tierce.',
    'footer.source': 'Code source',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];
