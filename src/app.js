const express = require("express");
const cors = require("cors");

const logger = require("./middleware/logger.middleware.js");
const errorHandler = require("./middleware/error.middleware.js");

const authRoutes = require("./routes/auth.routes.js");
const inviteRoutes = require("./routes/invite.routes.js");
const rsvpRoutes = require("./routes/rsvp.routes.js");
const statsRoutes = require("./routes/stats.routes.js");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(logger);

app.use("/api/admin", authRoutes);
app.use("/api", inviteRoutes);
app.use("/api", rsvpRoutes);
app.use("/api/admin", statsRoutes);

app.use(errorHandler);

module.exports = app;
