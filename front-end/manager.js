var controls = new uiTopLevelContainer("./controls", "controls");

let pList = [];
let obj = {};
let eventsData = {};

controls.SetData({
  appFrame: {
    controlType: "appFrame",
  },
});

controls.on("login", (data) => {
  var socket = io({
    auth: { username: data.username, password: data.password },
  });
  //socket.emit('login', data);

  socket.on("connect_error", (err) => {
    console.log("Unable to connect to manager: " + err.message);
  });

  socket.on("connect", () => {
    console.log("Connected to manager");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from manager");
  });

  socket.on("data", (data) => {
    controls.appFrame.SetData(data);
    console.log(data);
  });


  socket.on("timeSerieData", (data) => {
    //socket.emit('timeSerieData', data.appFrame);
    console.log(data);
    controls.appFrame.SetData(data);
  });


  // Forward data from client UI to server
  controls.on("data", (data) => {
    socket.emit("data", data.appFrame);
  });

  controls.on("req_newDevice", () => {
    socket.emit("req_newDevice");
  });

  controls.on("req_removeDevice", (id) => {
    socket.emit("req_removeDevice", id);
  });

  controls.on("req_getTimeSerieData", (id) => {
    socket.emit("req_getTimeSerieData", id);
  });

  controls.on("req_updateDevice", (data) => {
    socket.emit("req_updateDevice", data);
  });

  controls.on("tagPanelData", (data) => {
    socket.emit("tagPanelData", data);
  });

  controls.on("tagExtractAction", (data) => {
    socket.emit("tagExtractAction", data);
  });

  controls.on("tagModifyAction", (data) => {
    socket.emit("tagModifyAction", data);
  });

  controls.on("getAction", (data) => {
    socket.emit("getAction", data);
    //console.log(controls.appFrame, data.id);

    // TODO: look this action

    console.log("manager", data.id, data.deviceCommand);
  });

  console.log("manager ///", data);
});
