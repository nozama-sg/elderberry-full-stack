import initState from "../state";
import { login } from "./profile";
import {
  updateChat,
  updateCurrLocation,
  updateIntervalData,
  updateAnomaly,
} from "./updateData";
import { addFood, updateFoodGroup, updateLastMeal } from "./updateFoodData";

let reducer = (state = initState, action) => {
  if (action.type == "loginAsUser") {
    return login(state, action);
  } else if (action.type == "logout") {
    return initState;
  }

  if (action.type == "refresh") {
    return {
      ...initState,
      userInfo: state.userInfo,
      login: state.login,
      elderlyInfo: state.elderlyInfo,
    };
  }

  let actions = action.type.split("/");

  if (actions[0] == "update") {
    // For those with time interval, e.g. heart rate daily / weekly
    if (actions.length > 2) {
      return updateIntervalData(state, action, actions);

      // For chat
    } else if (actions[1] == "chat") {
      return updateChat(state, action);
    } else if (actions[1] == "elderlyInfo") {
      return updateElderlyInfo(state, action);
    } else if (actions[1] == "lastMealData") {
      return updateLastMeal(state, action);
    } else if (actions[1] == "currentLocation") {
      return updateCurrLocation(state, action);
    } else if (actions[1] == "foodGroup") {
      return updateFoodGroup(state, action);
    } else if (actions[1] == "addFood") {
    } else if (actions[1] == "anomaly") {
      return updateAnomaly(state, action);
    }
  } else if (actions[0] == "delete") {
    if (actions[1] == "lastMeal") {
      return addFood(state, action);
    }
  }

  return state;
};

export default reducer;
