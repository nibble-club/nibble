import { combineReducers } from "redux";

import { USER_SIGN_IN, USER_SIGN_OUT } from "./actions";

type UserAction = {
  type: string;
  email: string;
  id: string;
  admin: boolean;
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

const nibbleState = combineReducers({ user });

export default nibbleState;

export type RootState = ReturnType<typeof nibbleState>;
