import { combineReducers } from "redux";

import { LatLon } from "../graphql/generated/types";
import {
  HIDE_MESSAGE,
  HIDE_SEARCH,
  MessageType,
  SHOW_MESSAGE,
  SHOW_SEARCH,
  USER_LOCATION,
  USER_POSTAL_CODE,
  USER_SIGN_IN,
  USER_SIGN_OUT
} from "./actions";

type UserAction = {
  type: string;
  email: string;
  id: string;
  admin: boolean;
};

type MessageAction = {
  type: string;
  message: string;
  messageType: MessageType;
};

type PostalCodeAction = {
  type: string;
  postalCode: string;
};

type LocationAction = {
  type: string;
  location: LatLon;
};

type SearchAction = {
  type: string;
};

function user(state = { email: "", id: "", admin: false }, action: UserAction) {
  switch (action.type) {
    case USER_SIGN_IN:
      return { ...state, email: action.email, id: action.id, admin: action.admin };
    case USER_SIGN_OUT:
      return { ...state, email: "", id: "", admin: false };
    default:
      return state;
  }
}

function message(
  state = { message: "", messageType: MessageType.None },
  action: MessageAction
) {
  switch (action.type) {
    case SHOW_MESSAGE:
      return { ...state, message: action.message, messageType: action.messageType };
    case HIDE_MESSAGE:
      return { ...state, message: "", messageType: MessageType.None };
    default:
      return state;
  }
}

function userPostalCode(state = { postalCode: "" }, action: PostalCodeAction) {
  switch (action.type) {
    case USER_POSTAL_CODE:
      return { ...state, postalCode: action.postalCode };
    default:
      return state;
  }
}

function userLocation(
  state = { location: { latitude: 0, longitude: 0 } },
  action: LocationAction
) {
  switch (action.type) {
    case USER_LOCATION:
      return { ...state, location: action.location };
    default:
      return state;
  }
}

function search(state = { show: false }, action: SearchAction) {
  switch (action.type) {
    case SHOW_SEARCH:
      return { ...state, show: true };
    case HIDE_SEARCH:
      return { ...state, show: false };
    default:
      return state;
  }
}

const nibbleState = combineReducers({
  user,
  message,
  userPostalCode,
  userLocation,
  search,
});

export default nibbleState;

export type RootState = ReturnType<typeof nibbleState>;
