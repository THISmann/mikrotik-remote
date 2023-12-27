// const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const smsPdu = require('node-sms-pdu');
const EventEmitter = require('events'); 
//const bcrypt = require("bcrypt");
// const http = require('http');
// const path = require('path');
// const manager_app = express();
// const manager_http = http.createServer(manager_app);
// const { Server } = require('socket.io');
// const { Socket } = require('dgram');
// const manager_io = new Server(manager_http);

/**
 * API accepting http post requests with an imei header containing the imei of a device, as well as the message data in the post request body.
 * On receipt of a valid message, a 'message' event is emitted containing the decoded data.
 * Message data format:
 * {
 *  IMEI,
 *  ip,
 *  data,
 *  timestamp
 * }
 */
class api extends EventEmitter {
    /**
     * @param {Number} port - TCP port the API will listen on
     * @param {String} virtualDir - Virtual Directory for the API
     */
    constructor(port, virtualDir) {
        super();

        // create the app instance 
        this._app = express();


        //configure api
        this._app.use(bodyParser.urlencoded({ extended: true }));
        this._app.use(bodyParser.text());

        //event handling 
        //this._app.post('/test', _processMsg(req, res));
        this._app.listen(port, () => {
            console.log('server is running !!!')
        });

        // Handle post requests
        // this._app.post(virtualDir, (req, res) => this._processMsg(req, res));

        this._app.post('/test', (req, res) => {
            res.end();
            this._processMsg(req, res);
        });

        // this._app.post('/register', (req, res) => {
        //     res.end();  
        //     this._processRegister(req, res); 
        //     res.status(201);
        // });

        // this._app.post('/login', (req, res) => {
        //     res.end();  
        //     this._processLogin(req, res); 
        // });
 
    }
    
    /**
     * the process function ectract the information inside the request and send the usefull data
     * @param {object} req - this object content the header , the body and all the information
     * @param {object} res - this object content the response of the api after the connection
     */
    // _processLogin(req, res) {
    //     this.emit('login', {
    //         email: req.body.email,
    //         password: req.body.password
    //     });
    //     this.on('token', (token) => {
    //         console.log('token', token); 
    //     })
    // }

    /**
     * the process function ectract the information inside the request and send the usefull data
     * @param {object} req - this object content the header , the body and all the information
     * @param {object} res - this object content the response of the api after the connection
     */
    // async _processRegister(req, res) {
    //     const salt = await bcrypt.genSalt(10);
    //     this.emit('register', {
    //         first_name: req.body.first_name,
    //         last_name: req.body.last_name,
    //         email: req.body.email,
    //         password: await bcrypt.hash(req.body.password, salt),
    //         location: req.body.location,
    //         phone: req.body.phone
    //     });
    // }

    /**
     * the process function ectract the information inside the request and send the usefull data
     * @param {object} req - this object content the header , the body and all the information
     * @param {object} res - this object content the response of the api after the connection
     */
    _processMsg(req, res) {
        // check for valid message  
         //console.log(req.body);
        if (req && req.headers && req.headers.id && req.body && req.ip) {
            let decoded = this._decode(req.body);
            let id =  req.headers.id;
            if (id) {
                this.emit('message', {
                    id: id,
                    ip: req.ip,
                    message: decoded,
                    timestamp: new Date()
                })
            }
            else {
                this.emit('error', 'Invalid Device_Name: ' + req.headers.id);
            }
        }
    }


    /**
     * Check GSM encoding and return decoded data (if encoded). Else returns data if not encoded.
     * @param {string} data - this id the log encoder that came from the router  
     * @returns the message that is decode with normal format
     */
    _decode(data) {
        // Test if the message is a GSM PDU
        const pduRegex = /[0-9A-F]{10,}/g;
        let match = data.toString().match(pduRegex);
        if (match) {
            // Extract encoded data from input data
            let encoded;
            if (Array.isArray(match)) {
                encoded = match[0];
            } else {
                encoded = match;
            }

            // Decode PDU
            let decoded = smsPdu.parse(encoded);
            if (decoded && decoded.text) {
                // Replace encoded data with decoded data
                console.log(decoded.text)
                return data.replace(pduRegex, decoded.text);

            } else {
                return data;
            }
        } else {
            return data;
        }
    }


}

module.exports.api = api;