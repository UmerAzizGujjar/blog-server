import Blog from '../models/Blog.js';

/**
 * Get all blogs (public - everyone can see all blogs)
 */
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })  // Sort by newest first
      .populate('author', 'username email');  // Get author details
    
    // Add like count and isLikedByUser for each post
    const blogsWithLikes = blogs.map(blog => {
      const blogObj = blog.toObject();
      blogObj.likes = blog.likes ? blog.likes.length : 0;
      blogObj.isLikedByUser = req.userId ? blog.likes.some(id => id.toString() === req.userId) : false;
      return blogObj;
    });
    
    res.json(blogsWithLikes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Create a new blog post (protected - only authenticated users)
 */
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    // Create new blog
    const blog = new Blog({
      title,
      content,
      author: req.userId,  // From auth middleware
      authorName: req.username  // From auth middleware
    });

    await blog.save();

    res.status(201).json({
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update a blog post (protected - only author can update)
 */
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Find blog
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only edit your own blogs' });
    }

    // Update blog
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    await blog.save();

    res.json({
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete a blog post (protected - only author can delete)
 */
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Find blog
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own blogs' });
    }

    // Delete blog
    await Blog.findByIdAndDelete(id);

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Like or unlike a blog post (protected - authenticated users only)
 */
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;

    // Find blog
    const blog = await Blog.findById(id).populate('author', 'username email');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user already liked this post
    const likeIndex = blog.likes.findIndex(userId => userId.toString() === req.userId);

    if (likeIndex > -1) {
      // User already liked, so unlike
      blog.likes.splice(likeIndex, 1);
    } else {
      // User hasn't liked, so add like
      blog.likes.push(req.userId);
    }

    await blog.save();

    // Return blog with like info
    const blogObj = blog.toObject();
    blogObj.likes = blog.likes.length;
    blogObj.isLikedByUser = likeIndex === -1;

    res.json(blogObj);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
