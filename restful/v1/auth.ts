import * as Users from '../../proxy/users';
import { Request, Response, NextFunction } from 'express';
import { trim, isEmail } from 'validator';
import * as tools from '../../utils/tools';
import { config } from '../../config';
import logger from '../../utils/logger';

const signuperror = (msg: string, res: Response) => {
    res.status(203);
    res.send({ msg, err: true });
};

const UserApi = {
    userSignUp: async (req: Request, res: Response, next: NextFunction) => {
        let username = trim(req.body.username).toLowerCase();
        let password = trim(req.body.password);
        let passwordex = trim(req.body.passwordex);
        let email = trim(req.body.email).toLowerCase();
        if ([username, password, passwordex, email].some(item => item === '')) {
            return signuperror('信息不完整。', res);
        }
        if (username.length < 5) {
            return signuperror('用户名至少需要5个字符。', res);
        }
        if (!tools.validateId(username)) {
            return signuperror('用户名不合法。', res);
        }
        if (!isEmail(email)) {
            return signuperror('邮箱不合法。', res);
        }
        if (password !== passwordex) {
            return signuperror('两次密码输入不一致。', res);
        }
        try {
            let query = { $or: [{ loginname: username }, { email }] };
            let users = await Users.getUsersByQuery(query, {});
            if (users.length > 0) {
                return signuperror('用户名或邮箱已被使用。', res);
            }
            let passhash = await tools.bhash(password);
            let avatarurl = Users.makerAvatarUrl(email);
            await Users.newAndSave(username, username, passhash, email, avatarurl, false);
        } catch (err) {
            if (err) {
                next(err);
            }
        }
    },

    userSignin: async (req: Request, res: Response, next: NextFunction) => {
        let username = trim(req.query.name).toLowerCase();
        let password = trim(req.query.password);
        try {
            let user = await Users.getUserByName(username);
            let compare = await tools.bcompare(password, user.password);
            if (compare) {
            let authToken = user._id + '$$$$' + user.loginname; // 以后可能会存储更多信息，用 $$$$ 来分隔
            let opts = {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: false
            };
            logger('http').log(authToken);
            res.cookie(config.auth_cookiename, authToken, opts);
            res.send({ result: true, msg: 'success' });
        }
        else {
            return signuperror('用户名密码不匹配', res);
        }
        } catch (err) {
            logger().error(err);
        }
    }
};

export default UserApi;
