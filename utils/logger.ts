import * as log4js from 'log4js';
import * as Express from 'express';
log4js.configure('./log4js_conf.json');

const levels: { [key: string]: log4js.Level } = {
    trace: log4js.levels.TRACE,
    debug: log4js.levels.DEBUG,
    info: log4js.levels.INFO,
    warn: log4js.levels.WARN,
    error: log4js.levels.ERROR,
    fatal: log4js.levels.FATAL
};

export default function logger(name = 'default') {
    return log4js.getLogger(name);
} // 配合 express 使用的方法

export function use(app: Express.Express, level: string) {
    level = level === '' ? 'debug' : level;
    app.use(log4js.connectLogger(log4js.getLogger('http'), {
        level,
        format: ':method :url :status'
    }));
}
