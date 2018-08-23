import * as mongoose from 'mongoose';
import BaseModel from './base_model';
import utility from 'utility';

export interface IUserSchema extends mongoose.Document {
    id: number;
    username: string;
    loginname: string;
    password:  string;
    email:  string;
    url:   string;
    profile_image_url: string;
    profile:string;
    avatar: string;
    is_block: boolean;
    active: boolean;
    create_at: Date;
    update_at: Date;
    accessToken: string;
}

const UserSchema = new mongoose.Schema({
    id: { type: Number },
    username: { type: String },
    loginname: { type: String },
    password: { type: String },
    email: { type: String },
    url: { type: String },
    profile_image_url: { type: String },
    profile: { type: String },
    avatar: { type: String },
    is_block: { type: Boolean, default: false },
    active: { type: Boolean },

    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    accessToken: { type: String }
});

UserSchema.plugin(BaseModel);
let userVirtualType = UserSchema.virtual('avatar_url');
userVirtualType.get(function() {
    let url = this.avatar || ('https://gravatar.com/avatar/' + utility.md5(this.email.toLowerCase()) + '?size=48');

    // www.gravatar.com 被墙
    url = url.replace('www.gravatar.com', 'gravatar.com');

    // 让协议自适应 protocol，使用 `//` 开头
    if (url.indexOf('http:') === 0) {
        url = url.slice(5);
    }

    // 如果是 github 的头像，则限制大小
    if (url.indexOf('githubusercontent') !== -1) {
        url += '&s=120';
    }

    return url;
});

UserSchema.index({ loginname: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ score: -1 });
UserSchema.index({ githubId: 1 });
UserSchema.index({ accessToken: 1 });

UserSchema.pre<IUserSchema>('save', function(next) {
    let now = new Date();
    this.update_at = now;
    next();
});

mongoose.model('User', UserSchema);
