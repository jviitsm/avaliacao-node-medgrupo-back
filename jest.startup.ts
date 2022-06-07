import * as jestCli from "jest-cli";

import { Server } from "./server/server";
import { enviroment } from "./common/enviroment";
import { Contato } from "./model/contacts.model";
import { contatoController } from "././controllers/contacts.controller";

let server: Server;

const beforeAllTests = async () => {
  try {
    enviroment.server.db.url =
      process.env.DB_URL ||
      "mongodb://localhost/avaliacao-node-contatos-test-db";
    enviroment.server.port = { port: process.env.SERVER_PORT || 3001 };
    server = new Server();
    await server.bootstrap([contatoController]);
    await Contato.remove({});
  } catch (error) {
    console.log(error);
  }
};

const afterAllTests = async () => {
  return await server.shutdown();
};

(async () => {
  await beforeAllTests();
  await jestCli.run();
  await afterAllTests();
})();
