import * as mongoose from 'mongoose';

export interface IAttachmentSchema extends mongoose.Document {
    length: number;
    chunckSize: number;
    uploadDate: Date;
    mds: string;
    filename: string;
    contentType: string;
    aliases: string[];
    metadata: any;
}

let attachmentSchema = new mongoose.Schema({
    length: { type: Number },
    chunkSize: { type: Number },
    uploadDate: { type: Date },
    md5: { type: String },
    filename: { type: String },
    contentType: { type: String },
    aliases: [{ type: String }],
    metadata: { type: mongoose.Schema.Types.Mixed }
}, { collection: 'fs.files', versionKey: '' });

attachmentSchema.index({ filename: 1 });
attachmentSchema.index({ article_id: -1 });
attachmentSchema.index({ md5: 1 });

mongoose.model('Attachment', attachmentSchema);
