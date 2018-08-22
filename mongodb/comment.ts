import mongoose, { Schema, Document } from 'mongoose';
import BaseModel from './base_model';

export interface ICommentSchema extends Document {
    id: number;
    article_id: number;
    name: string;
    comment: string;
    create_at: Date;
    update_at: Date;
}

const CommentSchema = new Schema({
    id: { type: Number },
    article_id: { type: Number },
    name: { type: String, default: 'anonymous' },
    comment: { type: String },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
})

CommentSchema.plugin(BaseModel);

CommentSchema.index({ "article_id": -1 }, { unique: true });
CommentSchema.index({ "author_id": 1 });

mongoose.model('Comment', CommentSchema);
