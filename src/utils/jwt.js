const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

console.log("JWT_SECRET in jwt.js:", JWT_SECRET);

function createAccessToken(username) {
  return jwt.sign({ username }, JWT_SECRET, {
    expiresIn: "1h",
    issuer: "wedding-api",
    audience: "wedding-admin",
  });
}

function verifyAccessToken(token) {
  console.log("JWT_SECRET during verify:", JWT_SECRET);

  return jwt.verify(token, JWT_SECRET, {
    issuer: "wedding-api",
    audience: "wedding-admin",
  });
}

module.exports = {
  createAccessToken,
  verifyAccessToken,
};
