import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(255, 'Title must be less than 255 characters')
      .trim(),
    content: z.string().min(1, 'Content is required').trim(),
  }),
});

export const updatePostSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Post ID must be a number'),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(255, 'Title must be less than 255 characters')
      .trim(),
    content: z.string().min(1, 'Content is required').trim(),
  }),
});

export const getPostSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Post ID must be a number'),
  }),
});

export const deletePostSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Post ID must be a number'),
  }),
});
