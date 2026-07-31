const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

function createAccessToken(username) {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: "7d" });
}

module.exports = {
  createAccessToken,
};
