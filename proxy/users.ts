import { User } from '../mongodb';
import { v4 } from 'uuid';
import * as utility from 'utility';
import { Types } from 'mongoose';

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param id 用户ID
 * @param callback 回调函数
 */
export function getUserByid(id: Types.ObjectId, callback: (...args: any[]) => void) {
    User.findOne({ _id: id }, callback);
}

/**
 * 根据用户名称，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param name 用户名称
 */
export function getUserByName(name: string) {
    return User.findOne({ loginname: name }).exec();
}

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param query 关键字
 * @param opt 选项
 * @param callback 回调函数
 */
export function getUsersByQuery(query: any, opt: any) {
    return User.find(query, '', opt).exec();
}

export function newAndSave(
    username: string,
    loginname: string,
    passhash: string,
    email: string,
    avatarUrl: string,
    active = false) {
    let user = new User();
    user.username = username;
    user.loginname = loginname;
    user.password = passhash;
    user.email = email;
    user.avatar = avatarUrl;
    user.active = active;
    user.accessToken = v4();
    return user.save();
}

export function makerAvatarUrl(email: string) {
    return 'http://www.gravatar.com/avatar/' + utility.md5(email.toLowerCase()) + '?size=48';
}
