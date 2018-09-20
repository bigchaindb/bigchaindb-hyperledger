// config
require("dotenv").config();

import { createServer } from "http";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import * as cluster from "cluster";
import Queue from "./queue";
import { handleErrors } from "./middlewares/errorHandler";

// routes
import BdbRouter from "./routes/BdbRouter";

// start master and processor
if (cluster.isMaster) {

  // rest api
  const app = express();

  // create server
  const server = createServer(app);

  // middleware
  app.use(function(req, res, next) {
    // headers?
    // Either use this or allow origins http://localhost:*
    // res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(compression());

  // routes
  app.use("/", BdbRouter);
  // handle thrown errors
  app.use(handleErrors);
  // listen
  const _server = server.listen(process.env.APP_PORT);
  _server.on("listening", onListening);
  _server.on("error", onError);

  // spawn queue processor
  cluster.fork();
} else {
  // processor
  const queue = new Queue();
  queue.process();
}

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
