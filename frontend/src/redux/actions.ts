import { LatLon } from "../graphql/generated/types";

// action types
export const USER_SIGN_IN = "USER_SIGN_IN";
export const USER_SIGN_OUT = "USER_SIGN_OUT";

export const SHOW_MESSAGE = "SHOW_MESSAGE";
export const HIDE_MESSAGE = "HIDE_MESSAGE";

export const USER_POSTAL_CODE = "USER_POSTAL_CODE";
export const USER_LOCATION = "USER_LOCATION";

export const SHOW_SEARCH = "SHOW_SEARCH";
export const HIDE_SEARCH = "HIDE_SEARCH";

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

export function userPostalCode(postalCode: string) {
  return { type: USER_POSTAL_CODE, postalCode };
}

export function userLocation(location: LatLon) {
  return { type: USER_LOCATION, location };
}

export function showSearch() {
  return { type: SHOW_SEARCH };
}

export function hideSearch() {
  return { type: HIDE_SEARCH };
}
