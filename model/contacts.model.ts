import * as mongoose from "mongoose";
import * as moment from "moment";
import { validateAge } from "../common/validators";

export interface Contato extends mongoose.Document {
  name: string;
  birthday: Date;
  gender: String;
  isActive: boolean;
}

const contactsSchema = new mongoose.Schema(
  {
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
        validator: validateAge,
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
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

contactsSchema.virtual("age").get(function () {
  return Math.floor(
    (Date.now() - this.birthday.getTime()) / (1000 * 3600 * 24 * 365)
  );
});

export const Contato = mongoose.model<Contato>("Contato", contactsSchema);
