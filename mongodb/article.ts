import mongoose, { Schema, Document, Types } from 'mongoose';
import BaseModel from './base_model';
import { ICounterSchema } from './counter';

export interface IArticleSchema extends Document {
	id: number;
	article_id: number;
	author_id: Types.ObjectId;
	figure: string[];
	maintext: string;
	postdate: Date;
	readtime: number;
	commitnumber: number;
	likedtime: number;
	title: string;
}

const ArticleSchema = new Schema({
	id: { type: Number },
	article_id: { type: Number },
	author_id: { type: Schema.Types.ObjectId },
	figure: { type: Array },
	maintext: { type: String },
	postdate: { type: Date, default: Date.now },
	readtime: { type: Number, default: 0 },
	commitsnumber: { type: Number, default: 0 },
	likedtime: { type: Number, default: 0 },
	title: { type: String }
});

const Conuter = mongoose.model<ICounterSchema>('Counter');

ArticleSchema.plugin(BaseModel);

ArticleSchema.index({ article_id: -1 }, { unique: true });
ArticleSchema.index({ author_id: 1 });
ArticleSchema.pre<IArticleSchema>('save', function(next) {
	let self = this;
	Conuter.findOneAndUpdate({ _id: 'entityid' }, { $inc: { seq: 1 } }, (err, counter) => {
		if (err || counter === null) { return next(err); }
		self.article_id = counter.seq + 1;
		next();
	});
});

mongoose.model('Article', ArticleSchema);
