import {
  CACHE_SENSOR_TELEMETRY,
  SET_NODE_NAME,
  SET_SENSOR_TYPE,
  GET_ERRORS,
  CACHE_IN_PROGRESS,
  SET_SENSOR_IN_INTERVAL
} from "../actions/types";

export default (store, action) => {
  const { sensors } = store.getState();
  const { dispatch } = store;
  let { sensorCreds, axiosCallDB, cachingProgress } = action.payload;
  const { nodeName, sensorType, from, to } = sensorCreds;
  const range = to - from;
  let interval = 0;
  const day = 1000 * 60 * 60 * 24;
  if (range >= day / 2 && range < day) interval = 5;
  else if (range >= day && range < day * 7) interval = 10;
  else if (range >= day * 7 && range < day * 14) interval = 15;
  else if (range >= day * 14 && range < day * 30) interval = 20;
  else if (range >= day * 30 && range < day * 60) interval = 30;
  else if (range >= day * 60) interval = 60;
  let intervalKey = "interval(" + interval + ")";
  cacheInProgress(true);
  sensorCreds.intervalKey = intervalKey;
  if (NodeHasCachedLog(sensors, nodeName)) {
    if (SensorHasCachedLog(sensors, nodeName, sensorType)) {
      if (
        sensorHasCachedLogInInerval(sensors, nodeName, sensorType, intervalKey)
      ) {
        let loggedFrom = sensors[nodeName][sensorType][intervalKey].from;
        if (loggedFrom <= from) {
          cachingProgress(sensorCreds);
          return cacheInProgress(false);
        } else if (loggedFrom > from) {
          sensorCreds.newTo = loggedFrom;
          axiosCallDB(sensorCreds)
            .then(res => {
              dispatch({
                type: SET_SENSOR_TYPE,
                payload: {
                  nodeName,
                  sensorType,
                  intervalKey,
                  from,
                  to,
                  sampleData: res
                }
              });
              cachingProgress(sensorCreds);
              return cacheInProgress(false);
            })
            .catch(err => getErrors(err));
        }
      } else
        axiosCallDB(sensorCreds)
          .then(res => {
            dispatch({
              type: SET_SENSOR_IN_INTERVAL,
              payload: {
                nodeName,
                sensorType,
                data: {
                  [intervalKey]: { from, to, sampleData: res }
                }
              }
            });
            cachingProgress(sensorCreds);
            return cacheInProgress(false);
          })
          .catch(err => getErrors(err));
    } else
      axiosCallDB(sensorCreds)
        .then(res => {
          dispatch({
            type: SET_NODE_NAME,
            payload: {
              nodeName,
              data: {
                [sensorType]: { [intervalKey]: { from, to, sampleData: res } }
              }
            }
          });
          cachingProgress(sensorCreds);
          return cacheInProgress(false);
        })
        .catch(err => getErrors(err));
  } else
    axiosCallDB(sensorCreds)
      .then(res => {
        dispatch({
          type: CACHE_SENSOR_TELEMETRY,
          payload: {
            [nodeName]: {
              [sensorType]: { [intervalKey]: { from, to, sampleData: res } }
            }
          }
        });
        cachingProgress(sensorCreds);
        return cacheInProgress(false);
      })
      .catch(err => getErrors(err));
};
const NodeHasCachedLog = (sensors, nodeName) =>
  Object.getOwnPropertyNames(sensors).indexOf(nodeName) > -1;

const SensorHasCachedLog = (sensors, nodeName, sensorType) =>
  Object.getOwnPropertyNames(sensors[nodeName]).indexOf(sensorType) > -1;

const sensorHasCachedLogInInerval = (
  sensors,
  nodeName,
  sensorType,
  intervalKey
) =>
  Object.getOwnPropertyNames(sensors[nodeName][sensorType]).indexOf(
    intervalKey
  ) > -1;

const cacheInProgress = bool => {
  return {
    type: CACHE_IN_PROGRESS,
    payload: bool
  };
};

const getErrors = err => {
  return {
    type: GET_ERRORS,
    payload: err.response.data
  };
};
