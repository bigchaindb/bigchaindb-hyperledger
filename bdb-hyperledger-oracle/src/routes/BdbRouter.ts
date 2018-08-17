import { Router, Request, Response, NextFunction } from "express";
import BigchainDBModel from '../model/bigchaindbModel';
import validate from '../middlewares/validator';
import PostRequest from '../schema/PostRequest';
import { io } from '../index';

let connectedClients = [];

// config
const config = require("../config/config");
const bigchaindbModel = new BigchainDBModel(config.bdb.url, config.bdb.app_key, config.bdb.app_id);

export class BdbRouter {

  router: Router;
  io
  /**
   * Initialize the MeRouter
   */
  constructor(io) {
    this.router = Router();
    this.io = io;
  }

  public async bdb(req: Request, res: Response, next: NextFunction) {
    try{
      //find Asset from BigchainDB
      let assetData = await bigchaindbModel.getAssetData(req.body.query);
      if(!assetData){
        throw new Error(`No Data availble for query ${req.body.query}`);
      }
      let result = processCallback(req.body.callback, assetData);
      res.status(202).send({status: "success", assetData, processedResult: result});
      //send data to client over websockets
      sendDataOverWebSocket(connectedClients, result);
  
    }
    catch(error){
      next(new Error(error));
    }
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.post("/oraclequery", validate({body: PostRequest}), this.bdb);

    //listen for the client socket connections
    this.io.on('connection', (socket) => {
      console.log("Client connected - " + socket.id);
      connectedClients.push(socket);
      console.log(`Client ${socket.id} added to the connected client list.`);

      socket.on('disconnect', () => {
        console.log("Client Disconnected - " + socket.id);
        //remove client from the connected client list
        var index = connectedClients.indexOf(socket);
        if (index > -1) {
          connectedClients.splice(index, 1);
          console.log(`Client ${socket.id} removed from the connected client list.`);
        }
      });
    });
  }
}

// Create the bdbRouter, and export its configured Express.Router
const bdbRoutes = new BdbRouter(io);
bdbRoutes.init();

//invoke callback input function with fetched data from BigchainDB
const processCallback = (callbackInStr, callbackInput) => {
  let callbackFromStr = new Function('return ' + callbackInStr)();
  let value = callbackFromStr(callbackInput);
  console.log(value);
  return value;
}

//send data to connected clients over web sockets
const sendDataOverWebSocket = (listOfClients, dataToSend) => {
  listOfClients.map(client => client.emit('data', dataToSend));
}

export default bdbRoutes.router;
