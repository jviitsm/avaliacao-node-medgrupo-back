"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const restify = require("restify");
const mongoose = require("mongoose");
const enviroment_1 = require("../common/enviroment");
const error_handler_1 = require("./error.handler");
class Server {
    initializeDb() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(enviroment_1.enviroment.server.db.url, {
            useMongoClient: true,
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: "meat-api",
                    version: "1.0.0",
                });
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.on("restifyError", error_handler_1.handleError);
                //Routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.listen(enviroment_1.enviroment.server.port, () => {
                    resolve(this.application);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initializeDb();
            yield this.initRoutes(routers);
            return this;
        });
    }
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose.disconnect();
            return this.application.close();
        });
    }
}
exports.Server = Server;
