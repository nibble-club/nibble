// action types
export const USER_SIGN_IN = "USER_SIGN_IN";
export const USER_SIGN_OUT = "USER_SIGN_OUT";

export const SHOW_MESSAGE = "SHOW_MESSAGE";
export const HIDE_MESSAGE = "HIDE_MESSAGE";

export enum MessageType {
  Error,
  Warning,
  Success,
  Information,
  None,
}

// action creators
export function userSignIn(email: string, id: string, admin: boolean) {
  return { type: USER_SIGN_IN, email, id, admin };
}

export function userSignOut() {
  return { type: USER_SIGN_OUT, email: "", id: "", admin: false };
}

export function showMessage(message: string, messageType: MessageType) {
  return { type: SHOW_MESSAGE, message, messageType };
}

export function hideMessage() {
  return { type: HIDE_MESSAGE };
}
