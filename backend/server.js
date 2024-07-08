const express = require("express");

const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

dotenv.config({ path: "backend/config/config.env" });



// Middleware to parse JSON bodies
app.use(express.json());




 

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
