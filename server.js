const { api } = require("./api");
const { postgre } = require("./postgre");
const tagFunctions = require("./tagFunctions");
const { loadConfig, saveConfig } = require("./config");
const { eventLog } = require("./eventLog");
const { rosApi } = require("./rosApi");
const express = require("express");
const http = require("http");
const path = require("path");
const manager_app = express();
const manager_http = http.createServer(manager_app);
const { Server } = require("socket.io");
const { Socket } = require("dgram");
const Result = require("pg/lib/result");
const manager_io = new Server(manager_http);
var uuid = require("uuid-random");
var random = require("random-world");
const { Console } = require("console");
var tagConfigurationData = [];
const url = "https://192.168.1.1/rest";
var scriptList = [];
const { Sequelize } = require("sequelize");
//const bcrypt = require("bcrypt");
//const jwt = require('jsonwebtoken');
// Load config from file
let config = loadConfig();
let save = saveConfig();
//const Models = require("./models")
//const User = Models.User
//const dotenv = require('dotenv');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// -------------------------------------
// Manager web-app
// -------------------------------------

try {
  manager_http.listen(8083, () => {
    console.log("Manager WebApp running on http://*:8083");
  });

  // Serve the default file
  manager_app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./front-end/manager.html"));
  });

  // Serve all the files
  manager_app.use(express.static(path.join(__dirname, "./front-end")));

  manager_io.use((router_socket, next) => {
    console.log(router_socket.handshake.auth);
    if (
      router_socket.handshake.auth.username == "userName" &&
      router_socket.handshake.auth.password == "userPassword"
    ) {
      next();
    } else {
      next(new Error("Invalid username or password"));
    }
  });

  manager_io.on("connection", (socket) => {
    console.log("manager webapp connected " + socket.handshake.auth.username);

    // Send all data to client, to be able to create the full user interface.

    deviceList()
      .then((result) => {
        socket.emit("data", result);
      })
      .catch((err) => {
        console.error(err);
        logger.log(err.message, "error");
      });

    // Listen for changes from client webapp
    socket.on("data", (data) => {
      // broadcast data to all other connected web clients
      socket.broadcast.emit("data", data);

      // Save data to the database
      Object.keys(data).forEach((id) => {
        Object.keys(data[id]).forEach((field) => {
          if (
            typeof data[id][field] == "string" ||
            typeof data[id][field] == "number" ||
            typeof data[id][field] == "boolean"
          ) {
            db.updateDeviceField(id, field, data[id][field]);
          }
        });
      });
    });

    // get the TimeSeries Data from the database
    socket.on("req_getTimeSerieData", (data) => {
      console.log("serieData", data);
      db.getTimeSeriesData(data)
        .then((result) => {
          //console.log('data',result);
          if (Object.keys(result).length === 0) {
            console.log("empty result");
          } else {
            console.log(result[0].tag_name + " = " + result[0].value);
            socket.emit("timeSerieData", result);
          }
          // resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });

    // create  a new divice here
    socket.on("req_newDevice", () => {
      db.addDevice(
        uuid(),
        random.country(),
        random.ip(),
        random.word(),
        random.sentence(),
        random.firstname()
      )
        .then((result) => {
          //console.log(result);
        })
        .catch((err) => {
          console.error(err);
        });
    });

    // Delete a device here
    socket.on("req_removeDevice", (id) => {
      // console.log(id);
      db.removeDevice(id)
        .then((result) => {
          console.log(result);
          manager_io.emit("data", { [id]: { remove: true } });
        })
        .catch((err) => console.error(err));
    });

    // Get user Action
    socket.on("getAction", (device) => {
      console.log("device", device);
      console.log(device);
      rosApi
        .query(
          `https://${device.ip}/rest/execute`,
          "POST",
          `${device.deviceUsername}`,
          `${device.devicePassword}`,
          { script: `${device.deviceCommand}` }
        )
        .then((data) => {
          //scriptList = data;
          console.log("success !!!", data);
          // TODO: find the answer to {ret: '*FFFFFFFF'}
          //socket.emit(`${device.id}.${device.deviceCommand}.Success`, data, "top");
          socket.emit("data", { status: data.ret });
          // the status is not change when i emit --fix
        })
        .catch((err) => {
          console.error(err);
          logger.log(err.message, "error");
          socket.emit("data", { status:err.message });
        })
        .finally(() => {
         // console.log('RAS !!!');
        });
    });
  });
} catch (error) {
  console.log("Unable to start manager WebApp:" + error.message);
}

// ----------------------------------------------------------------
// Socket.io communication with manager WebApp
// ----------------------------------------------------------------

// Server API used by routers to send log messages
var server = new api(config.api.port, config.api.virtualDir);

// logging file instance
var logger = new eventLog(config.eventLog.path);

// Postgres database instance
var db = new postgre(config.db);
db._connect().then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err, "unable to connect to the database");
})

// get the userAction from the data run it to the mikrotik router

// Subscribe to log messages received from routers
server.on("message", (msg) => {
  // console.log(msg);
  // Send new event log data to manager web-app
  manager_io.emit("data", {
    [msg.id]: { eventLog: msg.timestamp.toString() + " " + msg.message },
  });

  // this methods call the function inside the database to run all the process
  db.logMessage(msg.id, msg.ip, msg.timestamp, msg.message)
    .then((tagConfigList) => {
      tagConfigList.forEach((tagConfig) => {
        let val = tagFunctions.extractValue(tagConfig, msg.message);
        if (val >= 0) {
          db.appendTimeSeriesData(
            msg.id,
            tagConfig.name,
            val,
            msg.timestamp
          ).catch((err) => {
            logger.log(err.message, "error");
            console.log(err.message);
          });
          console.log(`${tagConfig.name}: ${val}`);
        }
      });
    })
    .catch((err) => {
      logger.log(err.message, "error");
      console.log(err.message);
    });
});

/**
 * Return the device list
 */
function deviceList() {
  return new Promise((resolve, reject) => {
    db.getDeviceList()
      .then((result) => {
        let pList = [];

        Object.keys(result).forEach((id) => {
          // add the controlType to the device (needed for modular-ui to create new controls).
          result[id].controlType = "device";
          // result[id].device_name = result[id].id;
          // delete result[id].name;

          result[id].eventLog = "";
          result[id].lastSeen = "";
          // Add the event log as a string

          pList.push(
            db
              .getEventLog(id)
              .then((data) => {
                data.rows.forEach((row) => {
                  result[id].eventLog +=
                    row.timestamp.toString() + " " + row.message + "\n";
                });
              })
              .catch((err) => {
                reject(err);
              })
          );

          pList.push(
            db
              .getOnlineStatus(id)
              .then((data) => {
                //console.log("status",data.rows[0].timestamp);
                result[id].lastSeen = data.rows[0].timestamp;
              })
              .catch((err) => {
                reject(err);
              })
          );
        });
        Promise.all(pList).then(() => {
          resolve(result);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
