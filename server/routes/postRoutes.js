const router = require('express').Router(); // Ensure this is at the top
const authMiddleware = require('../middleware/authMiddleware');
const Post = require('../models/Post');
const Community = require('../models/Community');

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, imageUrl, communityName } = req.body;

    if (!title || !communityName) {
      return res.status(400).json({ msg: 'Title and community name are required.' });
    }

    const community = await Community.findOne({ name: communityName });
    if (!community) {
      return res.status(404).json({ msg: 'Community not found.' });
    }

    const newPost = new Post({
      title,
      content,
      imageUrl,
      author: req.user.id,
      community: community._id,
    });

    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err)
 {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts
// @desc    Get all posts for the main feed
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .populate('community', ['name'])
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.get('/community/:communityName', async (req, res) => {
  try {
    // First, find the community by name to get its ID
    const community = await Community.findOne({ name: req.params.communityName });
    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    // Then, find all posts that reference this community's ID
    const posts = await Post.find({ community: community._id })
      .populate('author', ['username'])
      .populate('community', ['name'])
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// ... (keep existing imports and GET/POST routes) ...

// @route   PUT /api/posts/:id
// @desc    Update a user's own post
// @access  Private

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Authorization Check: Ensure the user owns the post
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update the fields
    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: { title, content } },
      { new: true } // This option returns the document after the update
    );
    
    // We need to re-populate the updated post to send back full details
    const populatedPost = await Post.findById(post._id)
        .populate('author', ['username'])
        .populate('community', ['name']);

    res.json(populatedPost);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a user's own post
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Authorization Check: Ensure the user owns the post
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Post removed successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// in server/routes/postRoutes.js

// @route   GET /api/posts/community/:communityName
// @desc    Get all posts for a specific community
// @access  Public


module.exports = router;