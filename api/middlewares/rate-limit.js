const rateLimit = require("express-rate-limit");

// Limit each IP to max requests per windowMs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  handler: function (req, res) {
    res.status(429).json({
      error: "Too many requests, please try again later.",
    });
  },
});

module.exports = limiter;
