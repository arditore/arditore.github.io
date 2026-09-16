import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { postsFor, postSlug } from '../../lib/blog';

export async function GET(context: APIContext) {
  const posts = await postsFor('fr');
  return rss({
    title: 'Arditore',
    description: "Notes sur l'investigation numérique, les systèmes et la vie privée.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/fr/blog/${postSlug(post)}/`,
    })),
  });
}
