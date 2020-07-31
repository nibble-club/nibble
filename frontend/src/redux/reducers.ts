import { combineReducers } from "redux";

import {
  HIDE_MESSAGE,
  MessageType,
  SHOW_MESSAGE,
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

const nibbleState = combineReducers({ user, message });

export default nibbleState;

export type RootState = ReturnType<typeof nibbleState>;
