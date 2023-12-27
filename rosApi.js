const fetch = require('node-fetch');

/**
 * RouterOS API functions for RouterOS V7
 */
class rosApi {
    /**
     * Query the RouterOS API
     * @param {string} url - API URL (see https://help.mikrotik.com/docs/display/ROS/REST+API)
     * @param {string} method - POST; GET; PUT; DELETE; PATCH
     * @param {string} username - Router username
     * @param {string} password - Router password
     * @param {Object} data - (Optional) Object to be included in http request body
     * @returns {Promise} - Promise with query result
     */
    static query(url, method, username, password, data = undefined) {

        return new Promise((resolve, reject) => {
            let options = {
                method: method,
                headers: this._authHeaders(username, password),
                redirect: 'follow',
            }
    
            // Add body if passed
            if (data) {
                try {
                    options['body'] = JSON.stringify(data);
                } catch {
                    options['body'] = data;
                }
            }
            
            // send request
            fetch(url, options).then(res => res.text())
                .then(json => {
                    resolve(JSON.parse(json));
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    static _authHeaders(username, password) {
        let httpHeaders = new Headers();
        httpHeaders.append('Authorization',
            'Basic ' + Buffer.from(username + ':' + password).toString('base64'));
        httpHeaders.append('Content-Type', 'application/json');
        return httpHeaders;
    }
}

module.exports.rosApi = rosApi;