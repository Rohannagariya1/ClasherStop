// Importing the Express library
const express = require("express");

// Creating an instance of the Express application
const app = express();


const { logger, LogFormat, LogLevel, TransporterType, ExpressMiddleware } = require("@gromo-fintech/log4g");
const loggerOptions = {
  enableStdout: true ,
  nameOfProject : "payoutgrid",
  fileOptions: {
      enableFile: true,
      logLevel : LogLevel.INFO,
      datePattern: 'DD-MM-YYYY',
      zippedArchive: false,
      maxSize: '10k', 
      maxDuration: '1d',
  },
  logLevel : LogLevel.INFO,
  logFormat : LogFormat.JSON,
  transporterType : TransporterType.BIFIRUCATED_BY_LOG_LEVEL,
  overrideConsole : true,
  enableAccessLog : true,
};
logger.setConfig(loggerOptions);
const loggingMiddleware = new ExpressMiddleware();
app.use(loggingMiddleware.requestMiddleware);
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(cookieParser());
// Importing a route
const product = require("./routes/productroute");

// Using the imported route for a specific path
const user = require("./routes/userroute");
const order = require("./routes/orderRoute");
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
//middleware for error
app.use(errorMiddleware);





// Exporting the Express application
module.exports = app;