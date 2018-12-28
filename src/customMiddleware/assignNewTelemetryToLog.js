import { DateTime } from "luxon";
import {} from "../actions/types";

export default (store, action) => {
  const { dispatch } = store;
  const { nodes } = store.getState().telemetry;
  const { name, type, value, units } = payload;
  let resultsArray = [];
  let avgOfArray = 0;
  let now = DateTime.utc();
  if (now.minute % 5 === 0)
    avgOfArray =
      resultsArray.reduce((acc, cur) => acc + cur) / resultsArray.length;

  if (now.minute % 10 === 0 && avgOfArray > 0) {
    avgOfArray +=
      resultsArray.reduce((acc, cur) => acc + cur) / resultsArray.length;
    avgOfArray /= 2;
  }
};
