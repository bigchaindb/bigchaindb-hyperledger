import { Router, Request, Response, NextFunction } from "express";
import appInsights from "applicationinsights";
import BigchainDBModel from '../model/bigchaindbModel';
import validate from '../middlewares/validator';
import PostRequest from '../schema/PostRequest';
import  debug from 'debug';

// config
const config = require("../config/config");
const bigchaindbModel = new BigchainDBModel(config.bdb.url, config.bdb.app_key, config.bdb.app_id);

export class BdbRouter {

  router: Router;
  appInsightsClient: appInsights.TelemetryClient;

  /**
   * Initialize the MeRouter
   */
  constructor() {
    this.router = Router();
    appInsights.setup(config.appInsights.key).start();
    this.appInsightsClient = appInsights.defaultClient;
  }

  public async bdb(req: Request, res: Response, next: NextFunction) {
    try{
      //find Asset from BigchainDB
      debug("Getting data for " + req.body.query)
      this.appInsightsClient.trackEvent({ name: "OracleBDBQuery", 
        properties: { assetId: req.body.query }})
      
      let assetData = await bigchaindbModel.getAssetData(req.body.query);
      
      if(!assetData){
        throw new Error(`No Data available for query ${req.body.query}`);
      }
      debug("Processing callback for " + req.body.query)
      
      this.appInsightsClient.trackEvent({ name: "OracleBDBData", 
        properties: { assetId: req.body.query, data: assetData }})
      
        let result = processCallback(req.body.callback, assetData);
      
      this.appInsightsClient.trackEvent({ name: "OracleProcessCallback", 
        properties: { assetId: req.body.query, callback: req.body.callback, data: assetData, result: result }})
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
