// Load environment variables from .env file
const dotenv = require("dotenv");
const path = require("path");
const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

// Import necessary module
const mysql = require("mysql2");

let connectionConfig = {
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "movies_db",
  connectionLimit: 10,
};

const connection = mysql.createConnection(connectionConfig);

// Display error message only in development mode
if (process.env.NODE_ENV === "development") {
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err.message);
      return;
    }
    console.log("Connected to the database");
  });
}

module.exports = connection;
