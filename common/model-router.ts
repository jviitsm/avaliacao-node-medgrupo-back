import { Router } from "./router";
import * as mongoose from "mongoose";
import { NotFoundError } from "restify-errors";

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
  basePath: string;
  pageSize: number = 2;

  constructor(protected model: mongoose.Model<D>) {
    super();
    this.basePath = `/${model.collection.name}`;
  }

  protected prepareOne(
    query: mongoose.DocumentQuery<D, D>
  ): mongoose.DocumentQuery<D, D> {
    return query;
  }

  envelope(document: any): any {
    let resource = Object.assign({ _links: {} }, document.toJSON());
    resource._links.self = `/${this.model.collection.name}/${resource._id}`;
    return resource;
  }

  envelopeAll(documents: any[], options: any = {}): any {
    const resource: any = {
      _links: {
        self: `${options.url}`,
      },
      items: documents,
    };
    if (options.page && options.count && options.pageSize) {
      if (options.page > 1) {
        resource._links.previous = `${this.basePath}?_page=${options.page - 1}`;
      }
      const remaining = options.count - options.page * options.pageSize;

      if (remaining > 0) {
        resource._links.next = `${this.basePath}?_page=${options.page + 1}`;
      }
    }
    return resource;
  }

  validateId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      next(new NotFoundError("Documento não encontrado"));
    } else {
      next();
    }
  };

  findAll = async (req, res, next) => {
    try {
      let page = parseInt(req.query._page) || 1;
      page = page > 0 ? page : 1;

      const skip = (page - 1) * this.pageSize;

      const count = await this.model.count({});

      const documents = await (<any>(
        this.model.find().skip(skip).limit(this.pageSize)
      ));
      this.renderAll(res, req, documents, {
        page,
        count,
        pageSize: this.pageSize,
        url: req.url,
      });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req, res, next) => {
    try {
      const document = await this.prepareOne(
        this.model.findById(req.params.id)
      );
      this.render(res, next, document);
    } catch (error) {
      next(error);
    }
  };

  save = async (req, res, next) => {
    const document = new this.model(req.body);
    const saveDocument = await document.save();
    this.render(res, next, saveDocument);
  };

  replace = async (req, res, next) => {
    const options = { runValidators: true, overwrite: true };
    try {
      const result = await this.model.update(
        { _id: req.params.id },
        req.body,
        options
      );
      if (result.n) {
        const document = await this.model.findById(req.params.id);
        this.render(res, next, document);
      } else {
        throw new NotFoundError("Documento não encontrado");
      }
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    const options = { runValidators: true, new: true };

    try {
      const result = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        options
      );
      if (result) {
        this.render(res, next, result);
      }
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const cmdResult: any = await this.model
        .deleteOne({ _id: req.params.id })
        .exec();
      if (cmdResult.result.n) {
        res.send(204);
      } else {
        throw new NotFoundError("Document not found");
      }
    } catch (error) {}
  };
}
