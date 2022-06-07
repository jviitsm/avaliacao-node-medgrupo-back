"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contatoController = void 0;
const model_router_1 = require("../common/model-router");
const contacts_model_1 = require("../model/contacts.model");
class ContatosController extends model_router_1.ModelRouter {
    constructor() {
        super(contacts_model_1.Contato);
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.patch(`${this.basePath}/disable/:id`, [
            this.validateId,
            this.replace,
        ]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
    }
}
exports.contatoController = new ContatosController();
