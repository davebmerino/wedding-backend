const { ADMIN_USERNAME, ADMIN_PASSWORD } = require("../config/env.js");
const { createAccessToken } = require("../utils/jwt.js");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ detail: "Invalid credentials" });
  }

  const token = createAccessToken(username);

  res.json({
    access_token: token,
    token_type: "bearer",
  });
};
