import { ui, defaultLang, type Lang, type UIKey } from './ui';

const LOCALES: readonly Lang[] = ['en', 'fr'];

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return (LOCALES as readonly string[]).includes(first ?? '') ? (first as Lang) : defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return (ui[lang] as Record<string, string>)[key] ?? ui[defaultLang][key];
  };
}

export function stripLangPrefix(path: string): string {
  for (const l of LOCALES) {
    if (l === defaultLang) continue;
    if (path === `/${l}` || path === `/${l}/`) return '/';
    if (path.startsWith(`/${l}/`)) return path.slice(l.length + 1);
  }
  return path;
}

export function localeHome(lang: Lang): string {
  return lang === defaultLang ? '/' : `/${lang}/`;
}

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

export function publishedPosts<T extends { id: string; data: { draft: boolean } }>(
  entries: T[],
  lang: Lang,
): T[] {
  const prefix = `${lang}/`;
  return entries.filter((e) => e.id.startsWith(prefix) && !e.data.draft);
}
