import * as restify from "restify";
import * as mongoose from "mongoose";
import { enviroment } from "../common/enviroment";
import { Router } from "../common/router";
import { handleError } from "./error.handler";
export class Server {
  application: restify.Server;
  initializeDb(): mongoose.MongooseThenable {
    (<any>mongoose).Promise = global.Promise;
    return mongoose.connect(enviroment.server.db.url, {
      useMongoClient: true,
    });
  }

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: "meat-api",
          version: "1.0.0",
        });

        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());

        this.application.on("restifyError", handleError);

        //Routes
        for (let router of routers) {
          router.applyRoutes(this.application);
        }

        this.application.listen(enviroment.server.port, () => {
          resolve(this.application);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async bootstrap(routers: Router[] = []): Promise<Server> {
    await this.initializeDb();
    await this.initRoutes(routers);
    return this;
  }

  async shutdown() {
    await mongoose.disconnect();
    return this.application.close();
  }
}
