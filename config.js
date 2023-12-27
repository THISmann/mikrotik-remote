/**
 * Configuration management
 */

const fs = require('fs');

/**
 * Load configuration from config.json located in the runtime directory
 * @returns - configuration
 */
function loadConfig() {
    try {
        let c = fs.readFileSync('config.json');
        return JSON.parse(c);
    } catch (err) {
        console.log('Unable to load config.json. Creating a default configuration');

        saveConfig(defaultConfig());
        return defaultConfig();
    }
}
/**
 * Save configuration to config.json located in the runtime directory
 * @param {object} config - configuration
 */
function saveConfig(config) {
    try {
        fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
    } catch (err) {
        console.log('Unable to save config.json: ' + err.message);
    }
}


/**
 * Get the default configuration object
 */
function defaultConfig() {
    return {
        db: {
            user: "postgres",
            host: "db",
            database: "postgres",
            password: "password"
            // port: 5434
        },
        api: {
            port: 8081,
            virtualDir: ''
        },
        webapp: {
            port: 8082
        },
        eventLog: {
            path: "eventLog.log",
            rotationInterval: 86400,
            rotationStart: 5,
            compressAfter: 5
        },
        mikrotikApi: {
            user: "etienne",
            password: "FUH1234",
            url: "https://192.168.1.1/rest"
        } 
    }
}

module.exports.loadConfig = loadConfig;
module.exports.saveConfig = saveConfig;


