// Load environment variables from .env file
const dotenv = require("dotenv");
const path = require("path");
const envPath = path.join(__dirname, ".env");
dotenv.config({ path: envPath });

// Import necessary modules
const express = require("express");
const http = require("http");
const app = express();
const server = http.Server(app);

// Documentation imports
const swagger = require('./swagger');
swagger(app);

// Enable CORS with environment variable for the origin
const cors = require("cors");
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// List of configuration environments parameters required
const requiredEnv = ["PORT", "HOST"];

// Check if environment is provided
requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    console.error(`Environment variable ${env} is missing`);
  }
});

// Serve images from the img directory
app.use("/image", express.static(path.join(__dirname, "./")));

// Use environment variables or default values for host and port
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3002;

// Import your API routes
const api = require('./api/app');
app.use(api);

// Start the server and log the listening address
server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});
