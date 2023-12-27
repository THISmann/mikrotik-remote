const { Pool, Client } = require('pg');

/**
 * PostgreSQL connection and communication functions
 */
class postgre {
    /**
     * 
     * @param {object} config - Database configuration object:
     * {
            user,
            host,
            database,
            password,
            port
        }
     */
    constructor(config) {
        //create a new connection instance
        this._dbClient = new Client(config);
    }

    /**
     * Gets the database connection state
     */
    get isConnected() {
        return this._dbClient._connected;
    }

    /**
     * Connect to the database. If already connected to the database, resolves without reconnecting.
     * @returns promise resolving if the connection is successful and rejecting if unsuccessful
     */
    _connect() {
        return new Promise((resolve, reject) => {
            if (!this.isConnected) {
                this._dbClient.connect(err => {
                    if (err) {
                        reject(err);
                    } else {
                        // Resolve the connection result (true / false)
                        resolve(this._dbClient._connected);
                        console.log('database connected !!!')
                    }
                });
            } else {
                if (this.isConnected) {
                    resolve()
                } else {
                    reject(new Error('Unable to connect to the database: reason unknown'));
                }
            }
        });
    }

    _padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    /** Convert JS date to Postgress Timestamp without timezone */
    _convertDatePS(date) {
        return (
            [
                date.getFullYear(),
                this._padTo2Digits(date.getMonth() + 1),
                this._padTo2Digits(date.getDate()),
            ].join('-') +
            ' ' +
            [
                this._padTo2Digits(date.getHours()),
                this._padTo2Digits(date.getMinutes()),
                this._padTo2Digits(date.getSeconds()),
            ].join(':')
        );
    }

    /** Convert Postgress Timestamp without timezone to JS date */
    _convertDateJS(date) {
        return Date.parse(date);
    }

    /**
     * disconnect to the database
     * @returns promise with the connection state (true / false)
     */
    disconnect() {
        return this._dbClient.end();
    }

    /**
     * Get the full list of devices
     * @returns promise with db query result
     */
    getDeviceList() {
        return new Promise((resolve, reject) => {
            this._connect().then(() => {
                // Write PostGres stored function to return the public.devices table with an additional column which contains a concatenated 
                // string version of the event table for the given device ID.
                this._dbClient.query('SELECT * FROM public.devices').then(res => {
                    let list = {};
                    // Convert array to object
                    if (res && res.rows) {
                        res.rows.forEach(r => {
                            list[r.id] = r;
                        });
                    }
                    resolve(list);
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err)
            });
        });
    }

    /**
     * 
     * @param {string} id 
     * @param {string} device_name 
     * @param {text} description 
     * @param {text} tag_config 
     * @returns Promise
     */
    addDevice(id, device_name, ip,description, tag_config , technician){
        return new Promise((resolve, reject) => {
            this._connect().then(() => {
                this._dbClient.query('INSERT INTO public.devices(id, device_name, ip, "tag_config", "user_action", description, technician) VALUES ($1, $2, $3, $4, $5, $5 ,$6);',[id,device_name,ip,tag_config,description,technician]).then(data => {
                    resolve();
                }).catch(err => reject(err));
            }).catch(err => reject(err));
        })
    }


   
    /**
     * Update a device
     * @param {integer} id 
     * @param {string} name 
     * @param {string} description 
     * @param {JSON} tag_config 
     * @param {string} user_action 
     * @returns Promise when device has been updated
     */
    updateDevice(id, device_name, ip, description, tag_config, user_action, technician) {
        return new Promise((resolve, reject) => {
            this._connect().then(() => {
                // call the stored procedure inside the db 
               // console.table(Object.values(deviceData));
                this._dbClient.query('UPDATE public.devices SET id=$1, device_name=$2, ip=$3, "tag_config"=$4, "user_action"=$5, description=$6, technician=$7  WHERE id=$1', [ id,device_name,ip, tag_config, user_action, description,technician]).then(data => {
                    resolve();
                }).catch(err => { reject(err) });
            }).catch(err => { reject(err) });
        });
    }

    /**
     * Generic function to update a column in the Device table for a given device ID
     * @param {number} id - Device ID
     * @param {string}  column - field / column to be updated
     * @param {*} value - value
     */
    updateDeviceField(id, column, value) {
        return new Promise((resolve, reject) => {
            this._connect().then(() => {
                // To do: validate field to prevent SQL injection hacking
                // call the stored procedure inside the db 
               // console.table(Object.values(deviceData));
                this._dbClient.query(`UPDATE public.devices SET ${column}=$2 WHERE id=$1`, [ id, value ]).then(() => {
                    resolve();
                }).catch(err => { reject(err) });
            }).catch(err => { reject(err) });
        });
    }

    /**
     * 
     * @param {Number} id - the id of the device
     * @returns 
     */
    removeDevice(id) {
        // connection
        return new Promise((resolve, reject) => {
            this._connect().then(() => {
                this._dbClient.query('DELETE FROM public."eventLog" WHERE id = $1', [id]).then(data => {
                    //resolve();
                }).catch(err => { reject(err) });
            }).catch(err => { reject(err) });

            
            this._connect().then(() => {
                this._dbClient.query('DELETE FROM public."timeSeriesData" WHERE id = $1', [id]).then(data => {
                    //resolve();
                }).catch(err => { reject(err) });
            }).catch(err => { reject(err) });

            this._connect().then(() => {
                this._dbClient.query('DELETE FROM public."devices" WHERE id = $1', [id]).then(data => {
                    resolve();
                }).catch(err => { reject(err) });
            }).catch(err => { reject(err) })
        })

        // return this._dbClient.query('DELETE FROM device WHERE id = $1', [id]);
    }

    /**
     * get the information inside the tiemseries tables
     * @param {Number} deviceID - the id of the device
     * @param {string} tagName - the name of the device with the country and locality 
     * @returns 
     */
    getTimeSeriesData(id) {
        // connect to db and format output data
        return new Promise((resolve, reject) => {
            this._connect().then(() => {
                this._dbClient.query('SELECT tag_name,value FROM public."timeSeriesData" WHERE "id" = $1 ORDER BY "timestamp" DESC LIMIT 1', [id]).then(data => {
                    resolve(data.rows); 
                }).catch(err => { reject(err) });
            }).catch(err => { reject(err) })
        })

        //return this._dbClient.query('SELECT * FROM "TimeSeriesData" WHERE "deviceId" = $1 and "tagName" = $2', [deviceID, tagName]);
    }


    /**
     * add a new row inside the timeSeriesData table
     * @param {number} id 
     * @param {string} tagName 
     * @param {text} value 
     * @param {time} timestamp 
     * @returns 
     */
    appendTimeSeriesData(id, tagName, value, timestamp) {
        // connect to db
        // call the stored procedure inside  the db
        return new Promise((resolve, reject) => {
            this._connect().then(() => {
                this._dbClient.query('INSERT INTO public."timeSeriesData"(id, "tag_name", value, "timestamp")VALUES ($1, $2, $3, $4);', [id, tagName, value, this._convertDatePS(timestamp)]).then(data => {
                    resolve();
                }).catch(err => { reject(err) });
            }).catch(err => { reject(err) })
        })
    }

    /**
     * when the server receive the message this function check if the id exit to the database and of the id if not exist the add the emei inside the device table and insert the log event and the also check if the ip address is the same and if the ip address change the update the ip address
     * @param {String} id
     * @param {String} ip 
     * @param {Date} timestamp 
     * @param {String} data 
     * @returns {Object} Promise with tag configuration
     */
    logMessage(id, ip, timestamp, data) {
        return new Promise((resolve, reject) => {
            this._connect().then(() => {
                this._dbClient.query('SELECT public.logmessage( $1, $1, $2, $3, $4)', [id, ip, this._convertDatePS(timestamp), data]).then(data => {
                    if (data) {
                        try {
                            // Convert tag config to a JS object
                            //console.log(data.rows[0].logmessage);
                            resolve(JSON.parse(data.rows[0].logmessage));
                        } catch (err) {
                            reject(err);
                        }
                    } else {
                        resolve();
                    }
                }).catch(err => { reject(err) });
            }).catch(err => { reject(err) });
        });
    }

    /**
     * 
     * @param {bigint} id 
     * @returns {Array} all the eventLog entries for this device
     */
    getEventLog(id) {
        // connection
        return new Promise((resolve, reject) => {
            this._connect().then(() => { 
                this._dbClient.query('SELECT id, message, timestamp FROM public."eventLog" WHERE id= $1 ORDER BY id DESC LIMIT 50', [id]).then(data => {
                    resolve(data);
                    //console.log(data.rows);
                }).catch(err => { reject(err) });
            }).catch(err => { reject(err);
            console.error(err.message);
            })
        })
    }

    /**
     * device if the device is online or offline
     * @param {*} id 
     */
    getStatus(id){
        // TODO: - implement to progres 
        // find the last log send into the device with the router 
    }


    /**
     * insert a new tag_config at a specifique device
     * @param {int} id 
     * @param {Object} tag_config 
     */
    setTagConfig(id, tag_config) {
        // insert into the timeseries tables 
        return new Promise((resolve, reject) => {
            this._connect().then(() => {
                this._dbClient.query('precedure to insert data', [id, tag_config]).then(res => {
                    resolve(res);
                }).catch(err => { reject(err) });
            }).catch(err => { reject(err) })
        })
    }

    /**
     * send the user_action 
     * @param {int} id 
     * @returns 
     */
    getUserAction(id) {
        return new Promise((resolve, reject) => {
            this._connect().then(() => {
                this._dbClient.query('SELECT "user_action" FROM public.devices WHERE id=$1', [id]).then(data => {
                    if (data) {
                        try {
                            resolve(JSON.parse(JSON.stringify(data.rows[0].user_action)));
                        } catch (error) {
                            reject(err);
                        }
                    }

                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err)
            });
        });
    }

    /**
     * 
     * @param {int} id 
     * @returns 
     */
    getOnlineStatus(id) {
        return new Promise((resolve, reject) => {
            this._dbClient.query('SELECT timestamp FROM public."eventLog" where id = $1 ORDER BY TIMESTAMP DESC LIMIT 1',[id]).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        })
    }

    /**
     * 
     * @param {*} id 
     * @param {*} tagConfig 
     * @returns 
     */
    updateTagConfig(id, tagConfig) {
        return new Promise((resolve, reject) => {
            this._dbClient.query('UPDATE public.devices SET tag_config=$2 WHERE id=$1', [id, tagConfig]).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        })
    }

    /**
     * 
     * @param {*} id 
     * @param {*} first_name 
     * @param {*} last_name 
     * @param {*} email 
     * @param {*} password 
     * @param {*} location 
     * @param {*} phone 
     */
    registerUser(id, first_name, last_name, email, password, location, phone) {
        return new Promise((resolve, reject) => {
            this._dbClient.query('INSERT INTO public.Users $1, $2, $3, $4, $5, $6, $7',[id, first_name, last_name, email, password, location, phone]).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        })
    }

}

module.exports.postgre = postgre;