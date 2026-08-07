const { verifyAccessToken } = require("../utils/jwt");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // console.log("Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        detail: "Missing token",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Extracted token:", token);

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);

    return res.status(401).json({
      detail: "Invalid token",
    });
  }
};
