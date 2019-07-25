const {createLogger, format, transports} = require('winston');
const stringify = require("json-stringify-pretty-compact");
const {combine, timestamp, printf, colorize} = format;


const myFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

const objectPrettyPrint = format((info, opts) => {
    // console.log(info);
    if(typeof (info.message) === 'object') {
        info.message = stringify(info.message, {maxLength: 0, indent: 2});
    }

    return info
});

const toExport = module.exports = {
    createLogger: (options) => {
        const winstonLogger = toExport.createWinstonLogger(options);
        return newLogger("", winstonLogger);
    },
    createWinstonLogger: (options) => createLogger({
        format: combine(
            colorize(),
            timestamp(),
            format.splat(),
            format.simple(),
            objectPrettyPrint(),
            myFormat
        ),
        transports: [
            new transports.File(options.file),
            new transports.Console(options.console)
        ],
        exitOnError: true,
    }),
};

const logLine = (winston, ctx, loglevel, args) => {
    winston.log(loglevel, ctx + arrayOfSomeArgumentsToString(args).replace(/\n/g, "\n" + ctx));
};

const newLogger = exports.newLogger = (ctx, winston) => {
    ctx = ctx || "";
    winston = winston || {log: (l, s) => console.log(new Date().toISOString() + " " + l + " " + s)};

    return {
        TRACE: (...args) => logLine(winston, "********************" + this.ctx, "debug", args),
        debug: (...args) => logLine(winston, ctx, "debug", args),
        info: (...args) => logLine(winston, ctx, "info", args),
        warn: (...args) => logLine(winston, ctx, "warn", args),
        error: (...args) => logLine(winston, ctx, "error", args),
        createSublogger: (ctx2) => newLogger(ctx + ctx2, winston),
        sublog: (ctx2) => newLogger(ctx + ctx2, winston), // alias
    };
};

const arrayOfSomeArgumentsToString = (args) => {
    let res = "";
    for (let i = 0; i < args.length; i++) {
        let t = Object.prototype.toString.call(args[i]);
        res += (i === 0 ? "" : " ") +
            (t === '[object Object]' || t === '[object Array]' ?
                    stringify(args[i], {maxLength: 160, indent: 2}) :
                    // JSON.stringify(args[i]) : //, {maxLength: 160}) : // inspect(args[i], {depth: 1}) :
                    args[i]
            );
    }
    return res;
};
