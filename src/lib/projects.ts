import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type ProjectEntry = CollectionEntry<'projects'>;

export interface ProjectRoute {
  params: { slug: string };
  props: { entry: ProjectEntry; untranslated: boolean };
}

async function index() {
  const all = await getCollection('projects');
  const byKey = new Map<string, ProjectEntry>();
  const slugs = new Set<string>();

  for (const entry of all) {
    const [locale, ...rest] = entry.id.split('/');
    const slug = rest.join('/');
    if (!locale || !slug) continue;
    slugs.add(slug);
    byKey.set(`${locale}/${slug}`, entry);
  }

  return { byKey, slugs };
}

export async function projectRoutes(lang: Lang): Promise<ProjectRoute[]> {
  const { byKey, slugs } = await index();
  const routes: ProjectRoute[] = [];

  for (const slug of slugs) {
    const own = byKey.get(`${lang}/${slug}`);
    const entry = own ?? byKey.get(`en/${slug}`);
    if (!entry) continue;
    routes.push({ params: { slug }, props: { entry, untranslated: !own } });
  }

  return routes.sort((a, b) => a.props.entry.data.order - b.props.entry.data.order);
}

export async function projectList(lang: Lang): Promise<ProjectEntry[]> {
  const routes = await projectRoutes(lang);
  return routes.map((r) => r.props.entry);
}
