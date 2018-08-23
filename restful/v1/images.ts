import * as Attachment from '../../proxy/attachment';
import { Request, Response, NextFunction } from 'express';
import fs, { promises as fsp } from 'fs';
import { config } from '../../config';
import { createHash } from 'crypto';
import axios from 'axios';
import { getImageNameFromUrl } from '../../utils/tools';
import logger from '../../utils/logger';

async function loadFile(file: string) {
    const desFile = config.imageFileDir + file;
    let checkExist = false;
    try {
        await fsp.access(desFile);
        checkExist = true;
    } catch (err) {
        checkExist = false;
    }
    if (!checkExist) {
        let fileData = await Attachment.getFilebyName(file);
        if (!fileData) {
            return 'no file in db';
        }
        fs.writeFile(desFile, fileData, err => {
            return 'err';
        });
    }
}

async function writeImageToLocal(filename: string, buff: Buffer) {
    const desFile = config.imageFileDir + filename;
    return fsp.writeFile(desFile, buff).then(() => {
        return filename;
    }).catch(err => {
        return err;
    });
}

async function uploadFile(
    file: Express.Multer.File,
    articleId?: string | number,
    callback?: (...args: any[]) => void) {
    if (typeof articleId === 'function') {
        callback = articleId;
        articleId = 0;
    }
    const fileData = await fsp.readFile(file.path);
    let desFile = config.imageFileDir + file.originalname;
    let tmpfile = config.imageFileDir + file.filename;
    let md5sum = createHash('md5').update(fileData);
    let md5 = md5sum.digest('hex').toLowerCase();
    let checkExist = false;
    try {
        await fsp.access(desFile);
        checkExist = true;
    } catch (err) {
        checkExist = false;
    }
    const checkDb = await Attachment.getFilebyMd5(md5);
    if (!checkExist) {
        try {
            await fsp.writeFile(desFile, fileData);
        } catch (err) {
            logger().log('write file failed', err);
        }
    }
    if (checkDb != null) {
        try {
            await fsp.unlink(tmpfile);
        } catch (err) {
            logger().log(err);
        }
    }
    else {
        let response = {
            tmpfile,
            filename: file.originalname,
            filepath: config.imageFileDir,
            article_id: articleId
        };
        const newfile = await Attachment.saveFileToDb(response);
        if (newfile) {
            try {
                await fsp.unlink(tmpfile);
            } catch (err) {
                logger().log(err);
            }
        }
    }
    return file.originalname;
}

const images = {
    createImages: (req: Request, res: Response, next: NextFunction) => {
        let files = req.files;
        if (!(files instanceof Array)) {
            files = files[Object.keys(files)[0]];
        }
        let article_id = req.body.article_id;
        const promises: Array<Promise<string>> = [];
        // console.log(req.files);  // 上传的文件信息
        for (const file of files) {
            let upload = uploadFile(file, article_id, result => {
                if (!result) {
                    res.send('save error');
                    return;
                }
            });
            promises.push(upload);
        }

        Promise.all(promises).then(([...result]) => {
            res.json({ addedImages: result });
        }).catch(([...err]) => {
            res.json({ err });
        });
    },

    createUrlImage: async (req: Request, res: Response, next: NextFunction) => {
        let url: string = req.body.url;
        if (!(url.startsWith('http://') || url.startsWith('https://'))) {
            url = 'http://'.concat(url);
        }

        const filename = getImageNameFromUrl(url);
        try {
            let imageRequet = await axios.get<Buffer>(url);
            let fileName = await writeImageToLocal(filename, imageRequet.data);
            let fileinfo = {
                tmpfile: config.imageFileDir + fileName,
                filename: fileName,
                filepath: config.imageFileDir
            };
            let addedImages = await Attachment.saveFileToDb(fileinfo);
            res.json({ addedImages });
        } catch (err) {
            res.json({ err });
        }
    },

    loadImages: (req: Request, res: Response, next: NextFunction) => {
        const imagesLoaded: [] = req.body.images;
        imagesLoaded.map(file => {
            loadFile(file);
        });
    }
};

export default images;
