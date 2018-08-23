import { Comment } from '../mongodb';
import { Document } from 'mongoose';

export function getCommentsByArticleId(article_id: number) {
	const query = Comment.find({ article_id });
	return query.exec();
}

export function newAndSave(article_id: number, name = 'anonymous', comment: string) {
	const commentInfo = new Comment();
	commentInfo.article_id = article_id;
	commentInfo.name = name;
	commentInfo.comment = comment;
	return commentInfo.save();
}
