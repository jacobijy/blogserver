import { Attachment } from '../mongodb';
import mongoose from 'mongoose';
import * as GridFs from 'gridfs-stream';
import { createReadStream } from 'fs';

const connection = mongoose.connection;

let gfs: GridFs.Grid;
connection.once('open', () => {
    gfs = GridFs(connection.db, mongoose.mongo);
});

/**
 * 根据图片名字，查找图片
 * Callback:
 * - err, 数据库异常
 * - filename, 图片名称
 * @param filename 图片名称
 */
export function getFilebyName(filename: string) {
    return Attachment.findOne({ filename }).exec();
}

/**
 * 根据Md5，查找图片
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param md5 md5
 */
export function getFilebyMd5(md5: string) {
    return Attachment.findOne({ md5 }).exec();
}

export interface IFileInfo {
    filename: string;
    article_id?: number | string;
    tmpfile: string;
    filepath: string;
}

export function saveFileToDb(fileinfo: IFileInfo) {
    const writestream = gfs.createWriteStream({
        filename: fileinfo.filename,
        // article_id: parseInt(fileinfo.article_id)
    });
    createReadStream(fileinfo.tmpfile).pipe(writestream);
    return new Promise((resolve, reject) => {
        writestream.on('close', file => resolve(file));
        writestream.on('error', error => reject(error));
    });
}
