const router = require('express').Router(); // Ensure this is at the top
const authMiddleware = require('../middleware/authMiddleware');
const Community = require('../models/Community');
const User = require('../models/User');

// @route   POST /api/communities
// @desc    Create a new community
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ msg: 'Community name is required.' });
    }

    let community = await Community.findOne({ name: new RegExp('^' + name + '$', 'i') });
    if (community) {
      return res.status(400).json({ msg: 'A community with this name already exists.' });
    }

    community = new Community({
      name,
      creator: req.user.id,
      members: [req.user.id],
    });

    await community.save();
    res.status(201).json(community);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/', async (req, res) => {
  try {
    const communities = await Community.find().sort({ name: 1 }); // Sort alphabetically
    res.json(communities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router; // Ensure this is the last line