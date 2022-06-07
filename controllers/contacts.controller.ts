import { Server } from "restify";
import { ModelRouter } from "../common/model-router";
import { Contato } from "../model/contacts.model";
import * as moment from "moment";

class ContatosController extends ModelRouter<Contato> {
  constructor() {
    super(Contato);
  }

  applyRoutes(application: Server) {
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

export const contatoController = new ContatosController();
