import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { getPool } from '../config/database';

const router = Router();

// Get all posts
router.get('/', async (req: Request, res: Response) => {
  try {
    const pool = getPool();
    const result = await pool.query(`
      SELECT p.id, p.title, p.content, p.created_at, p.updated_at,
             u.username as author_username
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Get single post
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    
    const result = await pool.query(`
      SELECT p.id, p.title, p.content, p.created_at, p.updated_at,
             u.username as author_username
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post not found' },
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Create post
router.post(
  '/',
  [
    body('title').isLength({ min: 1, max: 255 }).trim().escape(),
    body('content').isLength({ min: 1 }).trim(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: { message: 'Validation failed', details: errors.array() },
        });
      }

      const { title, content } = req.body;
      const userId = 1; // TODO: Get from JWT token
      const pool = getPool();

      const result = await pool.query(
        'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING id, title, content, created_at',
        [userId, title, content]
      );

      const post = result.rows[0];

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post,
      });
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' },
      });
    }
  }
);

// Update post
router.put(
  '/:id',
  [
    body('title').isLength({ min: 1, max: 255 }).trim().escape(),
    body('content').isLength({ min: 1 }).trim(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: { message: 'Validation failed', details: errors.array() },
        });
      }

      const { id } = req.params;
      const { title, content } = req.body;
      const userId = 1; // TODO: Get from JWT token
      const pool = getPool();

      const result = await pool.query(
        'UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING id, title, content, updated_at',
        [title, content, id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: { message: 'Post not found or unauthorized' },
        });
      }

      res.json({
        success: true,
        message: 'Post updated successfully',
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Update post error:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' },
      });
    }
  }
);

// Delete post
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = 1; // TODO: Get from JWT token
    const pool = getPool();

    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post not found or unauthorized' },
      });
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
});

export const postsRouter = router; 