import {
  CACHE_SENSOR_TELEMETRY,
  CACHE_IN_PROGRESS,
  SET_NODE_NAME,
  SET_SENSOR_TYPE,
  SET_SENSOR_SAMPLE_RANGE,
  SET_SENSOR_IN_INTERVAL
} from "../actions/types";

const initialState = {
  caching: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CACHE_SENSOR_TELEMETRY:
      return {
        ...state,
        ...action.payload
      };

    case SET_NODE_NAME:
      let { nodeName, data } = action.payload;
      state[nodeName] = Object.assign(state[nodeName], data);
      return {
        ...state
      };

    case SET_SENSOR_IN_INTERVAL:
      let {
        nodeName: nodeName1,
        sensorType: sensorType1,
        data: data1
      } = action.payload;
      state[nodeName1][sensorType1] = Object.assign(
        state[nodeName1][sensorType1],
        data1
      );
      return {
        ...state
      };

    case SET_SENSOR_TYPE:
      let {
        nodeName: nodeName2,
        sensorType: sensorType2,
        from,
        to,
        intervalKey,
        sampleData
      } = action.payload;
      state[nodeName2][sensorType2][intervalKey].from = from;
      state[nodeName2][sensorType2][intervalKey].to = to;
      state[nodeName2][sensorType2][intervalKey].sampleData.unshift(
        ...sampleData
      );
      return {
        ...state
      };

    case SET_SENSOR_SAMPLE_RANGE:
      return state;

    case CACHE_IN_PROGRESS:
      return {
        ...state,
        caching: action.payload
      };

    default:
      return state;
  }
}
