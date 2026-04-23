const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// 1. GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Newest first
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST a new blog post
router.post('/', async (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    slug: req.body.title.toLowerCase().replace(/ /g, '-'), // Auto-generate slug from title
    content: req.body.content,
    excerpt: req.body.excerpt,
    category: req.body.category,
    featuredImage: req.body.featuredImage
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// 3. GET a single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 4. DELETE a post by ID
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. UPDATE a post by ID
router.put('/:id', async (req, res) => {
  try {
    // If they changed the title, we need to generate a new URL slug!
    const updatedData = {
      ...req.body,
      slug: req.body.title.toLowerCase().replace(/ /g, '-')
    };
    
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 4. DELETE a post by ID
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. UPDATE a post by ID
router.put('/:id', async (req, res) => {
  try {
    // If they changed the title, we need to generate a new URL slug!
    const updatedData = {
      ...req.body,
      slug: req.body.title.toLowerCase().replace(/ /g, '-')
    };
    
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;