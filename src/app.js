const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const logger = require("./middleware/logger.middleware.js");
const errorHandler = require("./middleware/error.middleware.js");

const authRoutes = require("./routes/auth.routes.js");
const inviteRoutes = require("./routes/invite.routes.js");
const rsvpRoutes = require("./routes/rsvp.routes.js");
const statsRoutes = require("./routes/stats.routes.js");

const allowedOrigins = [
  "http://localhost:5173",
  "https://www.maquicolladowedding.online",
];

const app = express();
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(logger);

app.use("/api/admin", authRoutes);
app.use("/api", inviteRoutes);
app.use("/api", rsvpRoutes);
app.use("/api/admin", statsRoutes);

app.use(errorHandler);

module.exports = app;
