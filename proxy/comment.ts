import { Comment } from '../mongodb';

export function getCommentsByArticleId(articleId: number) {
    const query = Comment.find({ article_id: articleId });
    return query.exec();
}

export function newAndSave(articleId: number, name = 'anonymous', comment: string) {
    const commentInfo = new Comment();
    commentInfo.article_id = articleId;
    commentInfo.name = name;
    commentInfo.comment = comment;
    return commentInfo.save();
}
