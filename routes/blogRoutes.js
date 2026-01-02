import express from 'express';
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike
} from '../controllers/blogController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * Blog Routes
 * GET    /api/blogs      - Get all blogs (public)
 * POST   /api/blogs      - Create new blog (protected)
 * PUT    /api/blogs/:id  - Update blog (protected, author only)
 * DELETE /api/blogs/:id  - Delete blog (protected, author only)
 * POST   /api/blogs/:id/like - Like/unlike blog (protected)
 */

router.get('/', getAllBlogs);
router.post('/', auth, createBlog);
router.put('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);
router.post('/:id/like', auth, toggleLike);

export default router;
