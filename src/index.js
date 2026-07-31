const app = require("./app");
const connectDB = require("./config/db");
const { PORT } = require("./config/env");

async function start() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  process.on("SIGTERM", async () => {
    server.close(() => process.exit(0));
  });

  process.on("SIGINT", async () => {
    server.close(() => process.exit(0));
  });
}

start();
