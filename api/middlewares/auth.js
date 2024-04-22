// Load environment variables from .env file
const dotenv = require("dotenv");
const path = require("path");
const envPath = path.join(__dirname, ".env");
dotenv.config({ path: envPath });

// Define a secret API key
const API_KEY = process.env.API_KEY;

// Create a middleware function to validate the API key
function validateApiKey(req, res, next) {
  // Get the API key from the "Authorization" header
  const apiKey = req.get("Authorization");

  // If the API key is not present
  if (!apiKey) {
    return res.status(401).send("Unauthorized");
  }

  // If the API key does not match the secret API key
  if (apiKey !== API_KEY) {
    return res.status(403).send("Forbidden");
  }

  // If the API key is valid, call the next middleware function
  return next();
}

// Use the middleware function to validate the API key for all routes
module.exports = validateApiKey;
