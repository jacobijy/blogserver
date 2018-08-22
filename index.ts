/*
 * @Author: Jacobi
 * @Date: 2018-05-20 11:08:01
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-22 22:23:39
 */
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger, { use as LoggerUse } from './utils/logger';
import http from 'http';
import { config } from './config';
import router from './routes';
import restfulApi from './restful';
import multer from 'multer';
import connectredis from 'connect-redis';
import session from 'express-session';
import SocketServer from './wsserver';
import debugFunc from 'debug';

const debug = debugFunc('blognode:server');
global.__SERVER__ = true;

const RedisStore = connectredis(session);

const app = express();
// view engine setup
console.log(path.join(__dirname, '../views'))
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || config.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

LoggerUse(app, 'info');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.session_secret));
app.use('/public', express.static(path.join(__dirname, '../client/public')));
app.use(multer({ dest: config.tmpFileDir }).array('image'));
app.use(session({
    secret: config.session_secret,
    store: new RedisStore({
        port: config.redis_port,
        host: config.redis_host,
        db: config.redis_db,
        pass: config.redis_password
    }),
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.use('/api', restfulApi)
app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    // console.log(next);
    // next(createError(404));
    // logger.error(res);
    // res.send('404 NOT FOUND');
    next(createError(404))
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    logger('http').error(err);
});
