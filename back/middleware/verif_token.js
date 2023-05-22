const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, 'shhhhh');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden' });
  }
}

module.exports = { verifyToken };