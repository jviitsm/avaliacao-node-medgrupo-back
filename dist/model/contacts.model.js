"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contato = void 0;
const mongoose = require("mongoose");
const validators_1 = require("../common/validators");
const contactsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
        max: [
            Date.now(),
            "A data de nascimento precisa ser maior do que a data de hoje. {VALUE}",
        ],
        validate: {
            validator: validators_1.validateAge,
            message: "O Contato precisa ser maior de 18 anos. {VALUE}",
        },
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Non-Binary"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
});
contactsSchema.virtual("age").get(function () {
    return Math.floor((Date.now() - this.birthday.getTime()) / (1000 * 3600 * 24 * 365));
});
exports.Contato = mongoose.model("Contato", contactsSchema);
