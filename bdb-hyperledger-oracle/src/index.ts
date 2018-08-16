import * as http from "http";
import * as debug from "debug";
import express from "express";
import * as bodyParser from "body-parser";
import compression from "compression";
import morgan from "morgan";

// routes
import BdbRouter from "./routes/BdbRouter";

// config
const config = require("./config/config");

// rest api
const app = express();
// middleware
app.use(function(req, res, next) {
  // headers?
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
// routes
app.use("/api/v1/bdb", BdbRouter);
// listen
const server = app.listen(config.app.port);
server.on("listening", onListening);
server.on("error", onError);

function onListening(): void {
  console.debug("Server thread started");
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== "listen") throw error;
  switch (error.code) {
    case "EACCES":
      console.error("Required elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error("Port is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}
