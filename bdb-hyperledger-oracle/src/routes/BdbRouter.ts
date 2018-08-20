import { Router, Request, Response, NextFunction } from "express";
import BigchainDBModel from '../model/bigchaindbModel';
import validate from '../middlewares/validator';
import PostRequest from '../schema/PostRequest';
import  debug from 'debug';

let connectedClients = [];

// config
const config = require("../config/config");
const bigchaindbModel = new BigchainDBModel(config.bdb.url, config.bdb.app_key, config.bdb.app_id);

export class BdbRouter {

  router: Router;

  /**
   * Initialize the MeRouter
   */
  constructor() {
    this.router = Router();
  }

  public async bdb(req: Request, res: Response, next: NextFunction) {
    try{
      //find Asset from BigchainDB
      debug("Getting data for " + req.body.query)
      let assetData = await bigchaindbModel.getAssetData(req.body.query);
      if(!assetData){
        throw new Error(`No Data availble for query ${req.body.query}`);
      }
      debug("Processing callback for " + req.body.query)
      let result = processCallback(req.body.callback, assetData);
      debug("Sending success " + req.body.query)
      res.status(202).send({status: "success", assetData, processedResult: result});
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
  }
}

// Create the bdbRouter, and export its configured Express.Router
const bdbRoutes = new BdbRouter();
bdbRoutes.init();

//invoke callback input function with fetched data from BigchainDB
const processCallback = (callbackInStr, callbackInput) => {
  let callbackFromStr = new Function('return ' + callbackInStr)();
  let value = callbackFromStr(callbackInput);
  console.log(value);
  return value;
}


export default bdbRoutes.router;
