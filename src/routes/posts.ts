import { Router, Request, Response } from 'express';
import { getPrisma } from '../config/prisma';
import { validateRequest } from '../middleware/validation';
import {
  createPostSchema,
  updatePostSchema,
  getPostSchema,
  deletePostSchema,
} from '../schemas/posts';

const router = Router();

// Get all posts
router.get('/', async (req: Request, res: Response) => {
  try {
    const prisma = getPrisma();
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      author_username: post.user.username,
    }));

    res.json({
      success: true,
      data: formattedPosts,
    });
    return;
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
    return;
  }
});

// Get single post
router.get(
  '/:id',
  validateRequest(getPostSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          error: { message: 'Post ID is required' },
        });
      }

      const prisma = getPrisma();

      const post = await prisma.post.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });

      if (!post) {
        res.status(404).json({
          success: false,
          error: { message: 'Post not found' },
        });
        return;
      }

      const formattedPost = {
        id: post.id,
        title: post.title,
        content: post.content,
        created_at: post.createdAt,
        updated_at: post.updatedAt,
        author_username: post.user.username,
      };

      res.json({
        success: true,
        data: formattedPost,
      });
      return;
    } catch (error) {
      console.error('Get post error:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' },
      });
      return;
    }
  }
);

// Create post
router.post(
  '/',
  validateRequest(createPostSchema),
  async (req: Request, res: Response) => {
    try {
      const { title, content } = req.body;
      const userId = 1; // TODO: Get from JWT token
      const prisma = getPrisma();

      const post = await prisma.post.create({
        data: {
          userId,
          title,
          content,
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: {
          id: post.id,
          title: post.title,
          content: post.content,
          created_at: post.createdAt,
        },
      });
      return;
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' },
      });
      return;
    }
  }
);

// Update post
router.put(
  '/:id',
  validateRequest(updatePostSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          error: { message: 'Post ID is required' },
        });
      }

      const { title, content } = req.body;
      const userId = 1; // TODO: Get from JWT token
      const prisma = getPrisma();

      const post = await prisma.post.updateMany({
        where: {
          id: parseInt(id),
          userId,
        },
        data: {
          title,
          content,
        },
      });

      if (post.count === 0) {
        res.status(404).json({
          success: false,
          error: { message: 'Post not found or unauthorized' },
        });
        return;
      }

      const updatedPost = await prisma.post.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          title: true,
          content: true,
          updatedAt: true,
        },
      });

      res.json({
        success: true,
        message: 'Post updated successfully',
        data: {
          id: updatedPost!.id,
          title: updatedPost!.title,
          content: updatedPost!.content,
          updated_at: updatedPost!.updatedAt,
        },
      });
      return;
    } catch (error) {
      console.error('Update post error:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' },
      });
      return;
    }
  }
);

// Delete post
router.delete(
  '/:id',
  validateRequest(deletePostSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          error: { message: 'Post ID is required' },
        });
      }

      const userId = 1; // TODO: Get from JWT token
      const prisma = getPrisma();

      const post = await prisma.post.deleteMany({
        where: {
          id: parseInt(id),
          userId,
        },
      });

      if (post.count === 0) {
        res.status(404).json({
          success: false,
          error: { message: 'Post not found or unauthorized' },
        });
        return;
      }

      res.json({
        success: true,
        message: 'Post deleted successfully',
      });
      return;
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' },
      });
      return;
    }
  }
);

export { router as postsRouter };
