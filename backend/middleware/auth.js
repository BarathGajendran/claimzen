const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if token is sent via authorization header as Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Enable token bypass for frontend pre-seeded demo session
      if (token === 'mock_jwt_token_for_hackathon_demo') {
        let user = await User.findOne({ email: 'barathg122@gmail.com' });
        if (!user) {
          user = await User.findOne({});
        }
        req.user = user;
        if (!req.user) {
          return res.status(401).json({ success: false, message: 'User not found in system' });
        }
        return next();
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'claimvision_secret_key_12345');

      // Get user from the token and attach to request object
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found in system' });
      }

      next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
