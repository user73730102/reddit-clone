const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Get token from the request header
  const token = req.header('x-auth-token');

  // 2. Check if no token is present
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the user payload to the request object
    req.user = decoded.user;
    
    // 5. Call the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;