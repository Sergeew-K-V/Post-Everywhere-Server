import { Request, Response } from 'express';
import { getPrisma } from '../config/prisma';

/**
 * Get all posts
 */
export async function getAllPosts(req: Request, res: Response): Promise<void> {
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
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
}

/**
 * Get single post by ID
 */
export async function getPostById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        error: { message: 'Post ID is required' },
      });
      return;
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
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
}

/**
 * Create new post
 */
export async function createPost(req: Request, res: Response): Promise<void> {
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
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
}

/**
 * Update post by ID
 */
export async function updatePost(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        error: { message: 'Post ID is required' },
      });
      return;
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
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
}

/**
 * Delete post by ID
 */
export async function deletePost(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        error: { message: 'Post ID is required' },
      });
      return;
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
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
}
