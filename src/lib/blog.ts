import { getCollection, type CollectionEntry } from 'astro:content';
import { publishedPosts } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

export type PostEntry = CollectionEntry<'blog'>;

export async function postsFor(lang: Lang): Promise<PostEntry[]> {
  const all = await getCollection('blog');
  return publishedPosts(all, lang).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

export async function hasPosts(lang: Lang): Promise<boolean> {
  return (await postsFor(lang)).length > 0;
}

export function postSlug(entry: PostEntry): string {
  return entry.id.replace(/^(en|fr)\//, '');
}

export function wordCount(body: string): number {
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`\[\]()-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}
