import mongoose, { Schema, Document } from "mongoose";

export interface ICounterSchema extends Document {
  seq: number;
}

const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

mongoose.model('Counter', CounterSchema);
