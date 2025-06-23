import { Router } from 'express';
import { validateRequest } from '../middleware/validation';
import {
  createPostSchema,
  updatePostSchema,
  getPostSchema,
  deletePostSchema,
} from '../schemas/posts';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers';

const router = Router();

// Get all posts
router.get('/', getAllPosts);

// Get single post
router.get('/:id', validateRequest(getPostSchema), getPostById);

// Create post
router.post('/', validateRequest(createPostSchema), createPost);

// Update post
router.put('/:id', validateRequest(updatePostSchema), updatePost);

// Delete post
router.delete('/:id', validateRequest(deletePostSchema), deletePost);

export { router as postsRouter };
