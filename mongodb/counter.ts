import * as mongoose from 'mongoose';

export interface ICounterSchema extends mongoose.Document {
  seq: number;
}

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

mongoose.model('Counter', CounterSchema);
