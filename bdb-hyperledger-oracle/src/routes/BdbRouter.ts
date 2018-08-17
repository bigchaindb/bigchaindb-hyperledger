import { Router, Request, Response, NextFunction } from "express";
import BigchainDBModel from '../model/bigchaindbModel';
import validate from '../middlewares/validator';
import PostRequest from '../schema/PostRequest';

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
      let assetData = await bigchaindbModel.getAssetData(req.body.query);
      if(!assetData){
        throw new Error(`No Data availble for query ${req.body.query}`);
      }
      let value = processCallback(req.body.callback, assetData);
      res.status(202).send({status: "success", assetData, processedResult: value});
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
    this.router.post("/", validate({body: PostRequest}), this.bdb);
  }
}

// Create the bdbRouter, and export its configured Express.Router
const bdbRoutes = new BdbRouter();
bdbRoutes.init();

const processCallback = (callbackInStr, callbackInput) => {
  let callbackFromStr = new Function('return ' + callbackInStr)();
  let value = callbackFromStr(callbackInput);
  console.log(value);
  return value;
}

export default bdbRoutes.router;
