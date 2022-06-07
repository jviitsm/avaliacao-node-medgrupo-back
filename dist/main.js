"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const contacts_controller_1 = require("./controllers/contacts.controller");
const server = new server_1.Server();
server
    .bootstrap([contacts_controller_1.contatoController])
    .then((server) => {
    console.log("Server is listening on:", server.application.address());
})
    .catch((error) => {
    console.log("Server failed to start");
    console.error(error);
    process.exit(1);
});
