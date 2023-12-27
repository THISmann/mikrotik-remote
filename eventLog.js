const rfs = require('rotating-file-stream');
var fs = require('fs');

/**
 * 
 * @property {string} path - 
 * @property {Number} rotationInterval - Log file rotation time in seconds (default = 1 day)
 * @property {DateTime} rotationStart - Rotation interval start date/time (default = 1 January 1970 00:00:00)
 * @property {Number} compressAfter - Compress files after compressAfter rotation intervals (default = 5)
 */
class eventLog {
    constructor(path, rotationInterval = 86400, rotationStart = 5, compressAfter = 5) {
        this._logFilePath = path;
    }

    /**
     * ||--||__||--||\/||--||__||--||
     * @param {string} file
     * @param {number} size 
     * @param {number} interval 
     * @param {number} compress 
     */
    compressLog(file, size, interval, compress) {
        rfs.createStream(file, {
            size: size, // rotate every 10 MegaBytes written
            interval: interval, // rotate daily
            compress: compress // compress rotated files
        });
    }

    /**
     * Log a message to the event log
     * @param {string} message - Message to be logged
     * @param {string} severity - severity indicator, e.g. Critical, Debug, Info, etc.
     * @returns 
     */
    log(message, severity , timestamp = new Date()) {
        return fs.appendFile(this._logFilePath, `${timestamp} ${message} ${severity}  \n`, err => {
            if (err) throw err;
        })
    }
}

module.exports.eventLog = eventLog;