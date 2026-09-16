import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { postsFor, postSlug } from '../lib/blog';

export async function GET(context: APIContext) {
  const posts = await postsFor('en');
  return rss({
    title: 'Arditore',
    description: 'Notes on digital forensics, systems and privacy.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${postSlug(post)}/`,
    })),
  });
}
