const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const requireAuth = require('../middleware/auth');

// Helper to format clean URL slugs
const createSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// @route   GET /api/posts
// @desc    Get all posts (Public - sorted by newest first)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching posts', error: err.message });
  }
});

// @route   GET /api/posts/id/:id
// @desc    Get single post by ID (Public)
// @access  Public
router.get('/id/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('createdBy', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching post', error: err.message });
  }
});

// @route   GET /api/posts/:slug
// @desc    Get single post by slug (Public)
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate('createdBy', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching post', error: err.message });
  }
});

// @route   POST /api/posts
// @desc    Create a new post (Admin only)
// @access  Private
router.post('/', requireAuth, async (req, res) => {
  try {
    const { heading, slug, blocks } = req.body;

    if (!heading) {
      return res.status(400).json({ message: 'Heading is required' });
    }

    const postSlug = slug ? createSlug(slug) : createSlug(heading);

    const existingPost = await Post.findOne({ slug: postSlug });
    if (existingPost) {
      return res.status(400).json({ message: 'A post with this title/slug already exists' });
    }

    const newPost = new Post({
      heading,
      slug: postSlug,
      blocks: blocks || [],
      createdBy: req.admin.id,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating post', error: err.message });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post by ID (Admin only)
// @access  Private
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { heading, slug, blocks } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (heading) post.heading = heading;
    if (slug) {
      const formattedSlug = createSlug(slug);
      const existingSlug = await Post.findOne({ slug: formattedSlug, _id: { $ne: req.params.id } });
      if (existingSlug) {
        return res.status(400).json({ message: 'A post with this slug already exists' });
      }
      post.slug = formattedSlug;
    }
    if (blocks) post.blocks = blocks;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating post', error: err.message });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post by ID (Admin only)
// @access  Private
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting post', error: err.message });
  }
});

module.exports = router;
