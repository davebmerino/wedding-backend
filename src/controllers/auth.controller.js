const { ADMIN_USERNAME, ADMIN_PASSWORD } = require("../config/env.js");
const jwt = require("jsonwebtoken");
const { createAccessToken } = require("../utils/jwt.js");

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        detail: "Username and password are required",
      });
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        detail: "Invalid credentials",
      });
    }

    const token = createAccessToken(username);
    // console.log("NEW TOKEN PAYLOAD:", jwt.decode(token));

    res.json({
      access_token: token,
      token_type: "bearer",
    });
  } catch (err) {
    next(err);
  }
};
