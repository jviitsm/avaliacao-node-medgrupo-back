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
const router_1 = require("./router");
const mongoose = require("mongoose");
const restify_errors_1 = require("restify-errors");
class ModelRouter extends router_1.Router {
    constructor(model) {
        super();
        this.model = model;
        this.pageSize = 2;
        this.validateId = (req, res, next) => {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                next(new restify_errors_1.NotFoundError("Documento não encontrado"));
            }
            else {
                next();
            }
        };
        this.findAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let page = parseInt(req.query._page) || 1;
                page = page > 0 ? page : 1;
                const skip = (page - 1) * this.pageSize;
                const count = yield this.model.count({});
                const documents = yield (this.model.find({ isActive: true }).skip(skip).limit(this.pageSize));
                this.renderAll(res, req, documents, {
                    page,
                    count,
                    pageSize: this.pageSize,
                    url: req.url,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.findById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const document = yield this.model.findOne({
                    _id: req.params.id,
                    isActive: true,
                });
                this.render(res, next, document);
            }
            catch (error) {
                next(error);
            }
        });
        this.save = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const document = new this.model(req.body);
                const saveDocument = yield document.save();
                this.render(res, next, saveDocument);
            }
            catch (error) {
                next(error);
            }
        });
        this.replace = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const options = { runValidators: true, overwrite: false };
            try {
                const result = yield this.model.update({ _id: req.params.id }, req.body, options);
                if (result.n) {
                    const document = yield this.model.findById(req.params.id);
                    this.render(res, next, document);
                }
                else {
                    throw new restify_errors_1.NotFoundError("Documento não encontrado");
                }
            }
            catch (error) {
                next(error);
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const options = { runValidators: true, new: true };
            try {
                const result = yield this.model.findByIdAndUpdate(req.params.id, req.body, options);
                if (result) {
                    this.render(res, next, result);
                }
            }
            catch (error) {
                next(error);
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const cmdResult = yield this.model
                    .deleteOne({ _id: req.params.id })
                    .exec();
                if (cmdResult.result.n) {
                    res.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError("Document not found");
                }
            }
            catch (error) {
                next(error);
            }
        });
        this.basePath = `/${model.collection.name}`;
    }
    prepareOne(query) {
        return query;
    }
    envelope(document) {
        let resource = Object.assign({ _links: {} }, document.toJSON());
        resource._links.self = `/${this.model.collection.name}/${resource._id}`;
        return resource;
    }
    envelopeAll(documents, options = {}) {
        const resource = {
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
}
exports.ModelRouter = ModelRouter;
