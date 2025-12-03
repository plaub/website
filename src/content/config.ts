import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.date(),
		categories: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		author: z.string().default('Pierre'),
		image: z.string().optional(),
		excerpt: z.string().optional(),
	}),
});

export const collections = {
	'blog': blogCollection,
};
