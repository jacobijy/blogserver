import * as Article from '../../proxy/article';
import { formatDate } from '../../utils/tools';
import { Request, Response, NextFunction } from 'express';
import logger from '../../utils/logger';

export interface IArticleInfo {
    maintext: string;
    author_id: string;
    title: string;
}

const ArticleApi = {
    loadArticle: async (req: Request, res: Response, next: NextFunction) => {
        let article_id = req.query.article_id;
        try {
            let result = await Article.getArtileByArticleid(article_id);
            res.json(result);
        } catch (err) {
            res.status(404).json(err);
        }
    },

    loadTitles: async (req: Request, res: Response, next: NextFunction) => {
        let author_id = req.query.author_id;
        try {
            let titles = await Article.getTitlesByAuthorId(author_id);
            logger().log(titles, 'test');
            res.json({ titles });
        } catch (err) {
            res.status(404).json(err);
        }
    },

    loadArticles: async (req: Request, res: Response, next: NextFunction) => {
        let { author_id, articleNumber } = req.query;
        try {
            let articles = await Article.getArticlesByAuthorId(author_id, articleNumber);
            let cnumber = parseInt(articleNumber, 10) + articles.length;
            res.json(Object.assign({}, { articles }, { number: cnumber }));
        } catch (err) {
            res.status(404).json(err);
        }
    },

    updateArticle: (req: Request, res: Response, next: NextFunction) => {
        let article = req.body;
        let { article_id, maintext, title, figure } = article;
        Article.updateArtileByAritcleid(article_id, maintext, title, figure, (err, doc, result) => {
            if (err) { res.json(err); }
            if (doc) { res.json(doc); }
        });
    },

    createArticle: async (req: Request, res: Response, next: NextFunction) => {
        let dateFormat = new Date();
        let date = formatDate(dateFormat);
        let articleInfo: IArticleInfo = {
            maintext: '<p><br></p>',
            author_id: req.body.author_id,
            title: date
        };
        try {
            let article = await Article.newAndSave(articleInfo);
            let opts = {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: false
            };
            res.cookie('ARTICLE_EDIT', article.article_id, opts);
            res.json({ article_id: article.article_id });
        } catch (err) {
            res.json(err);
        }
    }
};

export default ArticleApi;
