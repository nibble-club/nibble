// action types
export const USER_SIGN_IN = "USER_SIGN_IN";
export const USER_SIGN_OUT = "USER_SIGN_OUT";

// action creators
export function userSignIn(email: string, id: string, admin: boolean) {
  return { type: USER_SIGN_IN, email, id, admin };
}

export function userSignOut() {
  return { type: USER_SIGN_OUT, email: "", id: "", admin: false };
}
