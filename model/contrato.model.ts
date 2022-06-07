import * as mongoose from "mongoose";
import { enviroment } from "../common/enviroment";

export interface Contrato extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  cpf: string;
  gender: string;
  profiles: string[];
  matches(password: string): boolean;
  hasAny(...profiles: string[]): boolean;
}

export interface UserModel extends mongoose.Model<Contrato> {
  findByEmail(email: string, projection?: string): Promise<Contrato>;
}

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
    match:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    required: true,
  },
});

userSchema.statics.findByEmail = function (email: string, projection: string) {
  return this.findOne({ email }, projection).exec();
};

export const Contrato = mongoose.model<Contrato>("Contrato", contratoSchema);
