const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.js'); // Import the User model
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const authMiddleware = require('../middleware/authMiddleware');

// --- User Registration Route ---
// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    // 1. Destructure username, email, password from request body
    const { username, email, password } = req.body;

    // 2. Simple Validation: Check if fields are empty
    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields.' });
    }

    // 3. Check if user already exists
    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return res.status(400).json({ msg: 'User with this email already exists.' });
    }
    const existingUserByUsername = await User.findOne({ username: username });
    if (existingUserByUsername) {
        return res.status(400).json({ msg: 'This username is already taken.' });
    }

    // 4. Hash the password
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // 5. Create a new User instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // 6. Save the new user to the database
    const savedUser = await newUser.save();

    // 7. Respond with the created user's data (excluding the password)
    res.status(201).json({
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ... (keep the existing register route at the top)


// ... (register route code is here) ...

// --- User Login Route ---
// @route   POST /api/users/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        // 1. Destructure email and password from request body
        const { email, password } = req.body;

        // 2. Simple Validation
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields.' });
        }

        // 3. Check for existing user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }

        // 4. Validate password
        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials.' });
        }

        // 5. If credentials are correct, create a JWT
        const payload = {
            user: {
                id: user.id // The payload contains the user's unique ID
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '3h' }, // Token expires in 3 hours
            (err, token) => {
                if (err) throw err;
                // 6. Send the token and user info back to the client
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username
                    }
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
// --- Get Logged-In User Data Route ---
// @route   GET /api/users/me
// @desc    Get current user data (protected)
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user.id is available because our authMiddleware added it
    const user = await User.findById(req.user.id).select('-password'); // .select('-password') excludes the password from the result
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   PUT /api/users/update
// @desc    Update authenticated user's details (e.g., username, email)
// @access  Private
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Find the user to update
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if new username or email is already taken by someone else
    if (username && username !== user.username) {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ msg: 'Username is already taken.' });
        user.username = username;
    }
    if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: 'Email is already in use.' });
        user.email = email;
    }

    await user.save();
    
    // Send back the updated user data (excluding password)
    res.json({
        _id: user._id,
        username: user.username,
        email: user.email
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/users/delete
// @desc    Delete authenticated user's account
// @access  Private
// ... (imports)
const Post = require('../models/Post'); // <-- IMPORTANT: Import the Post model
// const Comment = require('../models/Comment'); // <-- You would add this later for comments

// ... (other routes)

// @route   DELETE /api/users/delete
// @desc    Delete authenticated user's account and all their content
// @access  Private
router.delete('/delete', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // --- START OF NEW LOGIC ---

    // 1. Delete all posts authored by the user
    // The `deleteMany` command is highly efficient for this.
    await Post.deleteMany({ author: userId });

    // 2. (Future) Delete all comments authored by the user
    // await Comment.deleteMany({ author: userId });

    // 3. (Future) We could also remove the user from any `members` arrays in Communities,
    // remove their votes from posts, etc. For now, deleting content is the priority.
    
    // --- END OF NEW LOGIC ---

    // Finally, delete the user themselves
    await User.findByIdAndDelete(userId);

    res.json({ msg: 'User account and all associated posts have been deleted successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
