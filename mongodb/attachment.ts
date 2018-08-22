import mongoose, { Schema, Document } from 'mongoose';

export interface IAttachmentSchema extends Document {
	length: number;
	chunckSize: number;
	uploadDate: Date;
	mds: string;
	filename: string;
	contentType: string;
	aliases: string[];
	metadata: any;
}

var attachmentSchema = new Schema({
	length: { type: Number },
	chunkSize: { type: Number },
	uploadDate: { type: Date },
	md5: { type: String },
	filename: { type: String },
	contentType: { type: String },
	aliases: [{ type: String }],
	metadata: { type: Schema.Types.Mixed }
}, { collection: "fs.files", versionKey: "" });

attachmentSchema.index({ filename: 1 });
attachmentSchema.index({ article_id: -1 });
attachmentSchema.index({ md5: 1 });

mongoose.model('Attachment', attachmentSchema);
