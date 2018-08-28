import { Router, Request, Response, NextFunction } from "express";
import validate from "../middlewares/validator";
import PostRequest from "../schema/PostRequest";
import debug from "debug";
import Queue from "../queue";

const queue = new Queue();
const appInsights = require("applicationinsights");

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
    queue.add(req.body);
    res.status(202).send();
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

export default bdbRoutes.router;
