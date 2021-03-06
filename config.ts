import { join } from 'path';

export const config = {
    port: '3000',
    host: '192.168.137.94',
    mongodb_conf: 'mongodb://localhost:27017/blog',
    debug: true,
    log_dir: join(__dirname, 'logs'),
    apiPort: 3000,
    apiHost: '192.168.137.94',
    imageFileDir: join(__dirname, 'views/public/images/'),
    session_secret: 'blog_node_jacobi_secret',
    auth_cookiename: 'blog_node',
    articleNumberLoadOnce: 6,

    default_api_version: 'v1',

    // redis 配置，默认是本地
    redis_host: '127.0.0.1',
    redis_port: 6379,
    redis_db: 0,
    redis_password: ''
};
