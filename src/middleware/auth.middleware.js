const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.js");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        detail: "Authorization required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        detail: "Token expired",
      });
    }

    return res.status(401).json({
      detail: "Invalid token",
    });
  }
};

module.exports = verifyToken;
