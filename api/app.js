const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

// Middleware imports
const limiter = require("./middlewares/rate-limit");
const apiKeyMiddleware = require("./middlewares/auth");

const app = express();

// Body parser middleware to handle JSON payloads
app.use(bodyParser.json({ limit: "50mb" }));

// API Key Authentication Middleware
//app.use(apiKeyMiddleware);

// Rate Limiting for API requests
app.use(limiter);

// Security headers with Helmet
app.use(helmet());

// Dynamically load and use route files
const routesPath = path.join(__dirname, "./routes");
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const route = require(`./routes/${file}`);
    app.use('/api-movie', route);
  }
});

module.exports = app;
