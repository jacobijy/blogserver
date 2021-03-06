import * as mongoose from 'mongoose';
import { config } from '../config';
import logger from '../utils/logger';
// models
import './counter';
import './users';
import './article';
import './attachment';
import './comment';
import { IArticleSchema } from './article';
import { IUserSchema } from './users';
import { ICounterSchema } from './counter';
import { ICommentSchema } from './comment';
import { IAttachmentSchema } from './attachment';

mongoose.connect(config.mongodb_conf, { poolSize: 20, useNewUrlParser: true }, (err) => {
    if (err) {
        logger('default').log(config.mongodb_conf);
        logger('default').error('connect to %s error: ', config.mongodb_conf, err.message);
        process.exit(1);
    }
}
);

export const User = mongoose.model<IUserSchema>('User');
export const Article = mongoose.model<IArticleSchema>('Article');
export const Attachment = mongoose.model<IAttachmentSchema>('Attachment');
export const Counter = mongoose.model<ICounterSchema>('Counter');
export const Comment = mongoose.model<ICommentSchema>('Comment');
