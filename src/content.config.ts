import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(['active', 'wip', 'archived']),
    repo: z.url(),
    tech: z.array(z.string()),
    topics: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().int().default(100),
    updated: z.coerce.date(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const cv = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/cv' }),
  schema: z.object({
    title: z.string(),
    updated: z.coerce.date(),
  }),
});

export const collections = { projects, blog, cv };
