import * as Attachment from '../../proxy/attachment';
import { Request, Response, NextFunction } from 'express';
import fs, { promises as fsp } from 'fs';
import { config } from '../../config';
import { createHash } from 'crypto';
import axios from 'axios';
import { getImageNameFromUrl } from '../../utils/tools';

const loadFile = async (file: string) => {
    const des_file = config.tmpFileDir + file;
    let check_exist = false;
    try {
        await fsp.access(des_file);
        check_exist = true;
    } catch (err) {
        check_exist = false;
    }
    if (!check_exist) {
        let file_data = await Attachment.getFilebyName(file)
        if (!file_data) {
            return 'no file in db'
        }
        fs.writeFile(des_file, file_data, err => {
            return 'err'
        });
    }
}

const writeImageToLocal = (filename: string, buff: Buffer) => {
    return new Promise((resolve, reject) => {
        const des_file = config.tmpFileDir + filename
        fs.writeFile(des_file, buff, err => {
            if (err) reject(err);
            resolve(filename)
        })
    });
}

const uploadFile = async (file: Express.Multer.File, article_id: string | number, callback) => {
    if (typeof article_id === 'function') {
        callback = article_id;
        article_id = 0;
    }
    const file_data = await fsp.readFile(file.path);
    let des_file = config.tmpFileDir + file.originalname;
    let tmpfile = config.tmpFileDir + file.filename;
    let md5sum = createHash('md5').update(file_data);
    let md5 = md5sum.digest('hex').toLowerCase();
    let check_exist = false;
    try {
        await fsp.access(des_file);
        check_exist = true;
    } catch (err) {
        check_exist = false;
    }
    const check_db = await Attachment.getFilebyMd5(md5);
    if (!check_exist) {
        try {
            await fsp.writeFile(des_file, file_data)
        } catch (err) {
            console.log('write file failed', err);
        }
    }
    if (check_db != null) {
        try {
            await fsp.unlink(tmpfile);
        } catch (err) {
            console.log(err);
        }
    }
    else {
        let response = {
            tmpfile,
            filename: file.originalname,
            filepath: config.tmpFileDir,
            article_id
        }
        const newfile = await Attachment.saveFileToDb(response);
        if (newfile) {
            try {
                await fsp.unlink(tmpfile);
            } catch (err) {
                console.log(err);
            }
        }
    }
    return file.originalname
}

const images = {
    createImages: (req: Request, res: Response, next: NextFunction) => {
        let files = req.files;
        let article_id = req.body.article_id;
        const promises = [];
        // console.log(req.files);  // 上传的文件信息
        for (const file of files) {
            let upload = uploadFile(file, article_id, result => {
                if (!result) {
                    res.send('save error');
                    return;
                }
            })
            promises.push(upload)
        }

        Promise.all(promises).then(([...result]) => {
            res.json({ addedImages: result })
        }).catch(([...err]) => {
            res.json({ err })
        })
    },

    createUrlImage: async (req: Request, res: Response, next: NextFunction) => {
        let url: string = req.body.url;
        if (!(url.startsWith('http://') || url.startsWith('https://'))) {
            url = 'http://'.concat(url);
        }

        const filename = getImageNameFromUrl(url);
        try {
            let imageRequet = await axios.get<Buffer>(url),
                file_name = await writeImageToLocal(filename, imageRequet.data),
                fileinfo = {
                    tmpfile: config.tmpFileDir + file_name,
                    filename: file_name,
                    filepath: config.tmpFileDir
                },
                images = await Attachment.saveFileToDb(fileinfo);
            res.json({ addedImages: images })
        } catch (err) {
            res.json({ err })
        }
    },

    loadImages: (req: Request, res: Response, next: NextFunction) => {
        const images: [] = req.body.images;
        images.map(file => {
            loadFile(file);
        })
    }
}

export default images