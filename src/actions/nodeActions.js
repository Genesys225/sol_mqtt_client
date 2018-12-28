import openSocket from "socket.io-client";

import { SET_NEW_TELEMETRY } from "./types";

const port = parseInt(process.env.REACT_APP_PORT) + 1;
const serverIp = process.env.REACT_APP_SERVER_IP;
console.log(`${serverIp}:${port}`);
console.log(process.env.NODE_ENV);
let socket = null;
if (process.env.NODE_ENV === "production") {
  socket = openSocket(`${serverIp}:${port}`);
} else {
  socket = openSocket("http://127.0.0.1:5001");
}
const subscribe2RegisteredNodes = () => dispatch => {
  socket.on("event", sensorPacket => {
    dispatch({
      type: SET_NEW_TELEMETRY,
      payload: sensorPacket
    });
  });
};

export { subscribe2RegisteredNodes };
