import * as restify from "restify";

const resolveError = (error): any => {
  const ErrorTypes: any = {
    CastError: function () {
      error.statusCode = 400;
      return error;
    },
    ValidationError: function () {
      const messages: any[] = [];
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

export const handleError = (
  req: restify.Request,
  res: restify.Request,
  err,
  done
) => {
  err.toJSON = () => {
    return {
      message: "Server Error",
      errors: err.message,
    };
  };
  console.log(err.name);
  resolveError(err);
  done();
};
