import { Router, Request, Response, NextFunction } from "express";
import BigchainDBModel from '../model/bigchaindbModel';
import validate from '../middlewares/validator';
import PostRequest from '../schema/PostRequest';
import debug from 'debug';
import request from 'request';

const appInsights = require('applicationinsights');

// config
const bigchaindbModel = new BigchainDBModel(process.env.BDB_URL, process.env.BDB_APP_KEY, process.env.BDB_APP_ID);

export class BdbRouter {

  router: Router;

  /**
   * Initialize the MeRouter
   */
  constructor() {
    this.router = Router();
    appInsights.setup(process.env.APPINSIGHTS_KEY).start();
  }

  public async bdb(req: Request, res: Response, next: NextFunction) {
    try {
      //find Asset from BigchainDB
      debug("Getting data for " + req.body.query)
      appInsights.defaultClient.trackEvent({
        name: "OracleBDBQuery",
        properties: { assetId: req.body.query }
      })

      const assetData = await bigchaindbModel.getAssetData(req.body.query);

      if (!assetData) {
        throw new Error(`No Data available for query ${req.body.query}`);
      }
      debug("Processing callback for " + req.body.query)

      appInsights.defaultClient.trackEvent({
        name: "OracleBDBData",
        properties: { assetId: req.body.query, data: assetData }
      })

      const result = processCallback(req.body.callback, assetData);

      appInsights.defaultClient.trackEvent({
        name: "OracleProcessCallback",
        properties: { assetId: req.body.query, callback: req.body.callback, data: assetData, result: result }
      })
      debug("Sending success " + req.body.query)

      request.post({ url: process.env.CHAINCODE_URL + '/oracle/result', json: { result: result } }, function(reqError, reqEesponse, reqBody) {
        if (!reqError) {
          res.status(202).send();
        } else {
          res.status(500).send();
        }
      })
    }
    catch (error) {
      next(new Error(error));
    }
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.post("/oraclequery", validate({ body: PostRequest }), this.bdb);
  }
}

// Create the bdbRouter, and export its configured Express.Router
const bdbRoutes = new BdbRouter();
bdbRoutes.init();

//invoke callback input function with fetched data from BigchainDB
const processCallback = (callbackInStr, callbackInput) => {
  const callbackFromStr = new Function('return ' + callbackInStr)();
  const value = callbackFromStr(callbackInput);
  console.log(value);
  return value;
}

export default bdbRoutes.router;
