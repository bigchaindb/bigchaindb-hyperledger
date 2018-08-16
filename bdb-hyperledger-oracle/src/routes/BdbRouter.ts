import { Router, Request, Response, NextFunction } from "express";

export class BdbRouter {
  router: Router;

  /**
   * Initialize the MeRouter
   */
  constructor() {
    this.router = Router();
  }

  public bdb(req: Request, res: Response, next: NextFunction) {
    res.send({status: "success"});
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get("/", this.bdb);
  }

}

// Create the bdbRouter, and export its configured Express.Router
const bdbRoutes = new BdbRouter();
bdbRoutes.init();

export default bdbRoutes.router;
