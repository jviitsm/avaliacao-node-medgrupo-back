"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contrato = void 0;
const mongoose = require("mongoose");
const contratoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3,
    },
    email: {
        type: String,
        unique: true,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true,
    },
});
userSchema.statics.findByEmail = function (email, projection) {
    return this.findOne({ email }, projection).exec();
};
exports.Contrato = mongoose.model("Contrato", contratoSchema);
