"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jestCli = require("jest-cli");
const server_1 = require("./server/server");
const enviroment_1 = require("./common/enviroment");
const contacts_model_1 = require("./model/contacts.model");
const contacts_controller_1 = require("././controllers/contacts.controller");
let server;
const beforeAllTests = () => __awaiter(this, void 0, void 0, function* () {
    try {
        enviroment_1.enviroment.server.db.url =
            process.env.DB_URL ||
                "mongodb://localhost/avaliacao-node-contatos-test-db";
        enviroment_1.enviroment.server.port = { port: process.env.SERVER_PORT || 3001 };
        server = new server_1.Server();
        yield server.bootstrap([contacts_controller_1.contatoController]);
        yield contacts_model_1.Contato.remove({});
    }
    catch (error) {
        console.log(error);
    }
});
const afterAllTests = () => __awaiter(this, void 0, void 0, function* () {
    return yield server.shutdown();
});
(() => __awaiter(this, void 0, void 0, function* () {
    yield beforeAllTests();
    yield jestCli.run();
    yield afterAllTests();
}))();
