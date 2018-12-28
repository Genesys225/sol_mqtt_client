import { SET_NEW_LOG_DATA } from "./types";

import axios from "axios";

const axiosCallDB = sensorCreds => {
  const { nodeName, sensorType, from, to, newFrom, newTo } = sensorCreds;
  return new Promise((resolve, reject) => {
    axios
      .get(
        `/api/telemetry/get-between/${nodeName}/${sensorType}/${
          newFrom ? newFrom : from
        }/${newTo ? newTo : to}`
      )
      .then(res => resolve(res.data))
      .catch(err => reject(err));
  });
};

export const fetchGraphData = (sensorCreds, cachingProgress) => dispatch => {
  dispatch({
    type: SET_NEW_LOG_DATA,
    payload: {
      sensorCreds,
      axiosCallDB,
      cachingProgress
    }
  });
};
