"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const resolveError = (error) => {
    const ErrorTypes = {
        CastError: function () {
            error.statusCode = 400;
            return error;
        },
        ValidationError: function () {
            const messages = [];
            for (let name in error.errors) {
                messages.push({ error: error.errors[name].message });
            }
            error.message = messages;
            error.statusCode = 400;
        },
        MongoError: function () {
            error.statusCode = 400;
            return error;
        },
        default: function () {
            return error;
        },
    };
    if (typeof ErrorTypes[error.name] === "function") {
        return ErrorTypes[error.name]();
    }
    return ErrorTypes.default();
};
const handleError = (req, res, err, done) => {
    err.toJSON = () => {
        return {
            message: "Server Error",
            errors: err.message,
        };
    };
    resolveError(err);
    done();
};
exports.handleError = handleError;
