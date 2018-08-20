import { createServer, Server } from "http";
import * as debug from "debug";
import express from "express";

import * as bodyParser from "body-parser";
import compression from "compression";
import morgan from "morgan";
import { handleErrors } from './middlewares/errorHandler';

// config
const config = require("./config/config");
const socketio = require("socket.io");

// rest api
const app = express();

//create server
const server = createServer(app);

//create socket server
export const io = socketio(server);

// import router (after socket server is exported)
import BdbRouter from "./routes/BdbRouter";

// middleware
app.use(function(req, res, next) {
  // headers?
  // Either use this or allow origins http://localhost:*
  //res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
// routes
app.use("/", BdbRouter);
//handle thrown errors
app.use(handleErrors);
// listen
const _server = server.listen(config.app.port);
_server.on("listening", onListening);
_server.on("error", onError);

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
