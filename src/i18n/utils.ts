import { ui, defaultLang, type Lang, type UIKey } from './ui';

const LOCALES: readonly Lang[] = ['en', 'fr'];

/** Langue déduite du premier segment de chemin ; anglais par défaut. */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return (LOCALES as readonly string[]).includes(first ?? '') ? (first as Lang) : defaultLang;
}

/** Traducteur pour une langue, avec repli silencieux sur l'anglais. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return (ui[lang] as Record<string, string>)[key] ?? ui[defaultLang][key];
  };
}

/** Retire le préfixe de langue d'un chemin, s'il y en a un. */
export function stripLangPrefix(path: string): string {
  for (const l of LOCALES) {
    if (l === defaultLang) continue;
    if (path === `/${l}` || path === `/${l}/`) return '/';
    if (path.startsWith(`/${l}/`)) return path.slice(l.length + 1);
  }
  return path;
}

/** Accueil d'une langue. */
export function localeHome(lang: Lang): string {
  return lang === defaultLang ? '/' : `/${lang}/`;
}

/**
 * Chemin équivalent dans une autre langue, en conservant la page courante.
 * Si `availablePaths` est fourni et que la page n'y figure pas, retombe sur
 * l'accueil de la langue cible plutôt que de mener à une 404.
 */
export function getLocalizedPath(
  currentPath: string,
  target: Lang,
  availablePaths?: ReadonlySet<string>,
): string {
  const bare = stripLangPrefix(currentPath);
  const mapped =
    bare === '/' ? localeHome(target) : target === defaultLang ? bare : `/${target}${bare}`;
  if (availablePaths && !availablePaths.has(mapped)) return localeHome(target);
  return mapped;
}

/** Articles publiés d'une langue : bon préfixe, et pas de brouillon. */
export function publishedPosts<T extends { id: string; data: { draft: boolean } }>(
  entries: T[],
  lang: Lang,
): T[] {
  const prefix = `${lang}/`;
  return entries.filter((e) => e.id.startsWith(prefix) && !e.data.draft);
}
