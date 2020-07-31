import React, { useState } from "react";
import { Field, Form, FormRenderProps } from "react-final-form";
import { useDispatch } from "react-redux";
import {
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch
} from "react-router-dom";

import Auth from "@aws-amplify/auth";

import { PASSWORD_REQUIRED_LENGTH, USER_TOKEN_KEY } from "../../common/constants";
import TextInput from "../../components/TextInput/TextInput";
import { userSignIn } from "../../redux/actions";
import { useStyles } from "./Login.style";

interface SignUpValues {
  email: string;
  fullName: string;
  postalCode: string;
  password: string;
  confirmPassword: string;
}

interface ConfirmEmailValues {
  code: string;
}

interface LoginValues {
  email: string;
  password: string;
}

interface ResetValues {
  email: string;
}

interface NewPasswordValues {
  code: string;
  password: string;
  confirmPassword: string;
}

interface ChangePasswordValues {
  password: string;
  confirmPassword: string;
}

type NavState = {
  referrer?: string;
};

const emailRegex = /^\S+@\S+\.\S+$/;

const passwordValidator = (password: string) => {
  if ((password?.length || 0) < PASSWORD_REQUIRED_LENGTH) {
    return "Please use at least 12 characters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Please include an uppercase character";
  } else if (!/[a-z]/.test(password)) {
    return "Please include a lowercase character";
  } else if (!/[0-9]/.test(password)) {
    return "Please include a number";
  } else if (!/[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`]/.test(password)) {
    return "Please include a special character";
  } else if (/\s/.test(password)) {
    return "Please do not include any whitespace";
  }
  return undefined;
};

const matchPasswordValidator = (copyPassword: string, allValues: any) =>
  copyPassword !== allValues.password ? "Your passwords don't match" : undefined;

const loginDisabled = (
  props: FormRenderProps<LoginValues, Partial<LoginValues>>
): boolean => {
  const validEmail = emailRegex.test(props.values.email || "");
  const validPassword =
    (props.values.password?.length || 0) >= PASSWORD_REQUIRED_LENGTH;
  return (
    props.submitting ||
    props.pristine ||
    (props.submitErrors && !props.dirtySinceLastSubmit) ||
    !validEmail ||
    !validPassword
  );
};

const LoginForm = (
  formRenderProps: FormRenderProps<LoginValues, Partial<LoginValues>>
) => (
  <form onSubmit={formRenderProps.handleSubmit}>
    <div>
      <Field<string> name="email" placeholder="Email" type="email">
        {fieldRenderProps => <TextInput center={true} {...fieldRenderProps} />}
      </Field>
    </div>
    <div>
      <Field<string> name="password" placeholder="Password" type="password">
        {fieldRenderProps => <TextInput center={true} {...fieldRenderProps} />}
      </Field>
    </div>
    {formRenderProps.submitErrors && (
      <div>
        <span>{formRenderProps.submitErrors.FORM_ERROR}</span>
      </div>
    )}
    <div>
      <button type="submit" disabled={loginDisabled(formRenderProps)}>
        Sign in
      </button>
    </div>
  </form>
);

const SignUpForm = (
  formRenderProps: FormRenderProps<SignUpValues, Partial<SignUpValues>>
) => (
  <form onSubmit={formRenderProps.handleSubmit}>
    <div>
      <Field<string> name="email" placeholder="Email" type="email">
        {fieldRenderProps => <TextInput center={true} {...fieldRenderProps} />}
      </Field>
      <Field<string> name="fullName" placeholder="Full name" type="text">
        {fieldRenderProps => <TextInput center={true} {...fieldRenderProps} />}
      </Field>
      <Field<string> name="postalCode" placeholder="Postal code" type="text">
        {fieldRenderProps => <TextInput center={true} {...fieldRenderProps} />}
      </Field>
      <Field<string>
        name="password"
        placeholder="Password"
        type="password"
        validate={passwordValidator}
      >
        {fieldRenderProps => (
          <div>
            <TextInput center={true} {...fieldRenderProps} />
            {fieldRenderProps.meta.error && fieldRenderProps.meta.touched && (
              <span>{fieldRenderProps.meta.error}</span>
            )}
          </div>
        )}
      </Field>
      <Field<string>
        name="confirmPassword"
        placeholder="Confirm password"
        type="password"
        validate={matchPasswordValidator}
      >
        {fieldRenderProps => (
          <div>
            <TextInput center={true} {...fieldRenderProps} />
            {fieldRenderProps.meta.error && fieldRenderProps.meta.touched && (
              <span>{fieldRenderProps.meta.error}</span>
            )}
          </div>
        )}
      </Field>
    </div>
    {formRenderProps.submitErrors && (
      <div>
        <span>{formRenderProps.submitErrors.FORM_ERROR}</span>
      </div>
    )}
    <button
      type="submit"
      disabled={
        formRenderProps.pristine ||
        formRenderProps.submitting ||
        !emailRegex.test(formRenderProps.values.email) ||
        (formRenderProps.values.password?.length || 0) < PASSWORD_REQUIRED_LENGTH ||
        formRenderProps.values.password !== formRenderProps.values.confirmPassword ||
        (formRenderProps.values.postalCode?.length || 0) !== 5
      }
    >
      Submit
    </button>
  </form>
);

const ConfirmEmailForm = (
  formRenderProps: FormRenderProps<ConfirmEmailValues, Partial<ConfirmEmailValues>>
) => (
  <form onSubmit={formRenderProps.handleSubmit}>
    <div>
      <Field<string> name="code" placeholder="Code" type="text">
        {fieldRenderProps => <TextInput center={true} {...fieldRenderProps} />}
      </Field>
    </div>
    <div>
      <button
        type="submit"
        disabled={formRenderProps.pristine || formRenderProps.submitting}
      >
        Submit
      </button>
    </div>
  </form>
);

const ResetPasswordForm = (
  formRenderProps: FormRenderProps<ResetValues, Partial<ResetValues>>
) => (
  <form onSubmit={formRenderProps.handleSubmit}>
    <div>
      <Field<string> name="email" placeholder="Email" type="email">
        {fieldRenderProps => <TextInput center={true} {...fieldRenderProps} />}
      </Field>
    </div>
    <div>
      <button
        type="submit"
        disabled={
          formRenderProps.pristine ||
          formRenderProps.submitting ||
          !emailRegex.test(formRenderProps.values.email)
        }
      >
        Submit
      </button>
    </div>
  </form>
);

const NewPasswordForm = (
  formRenderProps: FormRenderProps<NewPasswordValues, Partial<NewPasswordValues>>
) => (
  <form onSubmit={formRenderProps.handleSubmit}>
    <div>
      <Field<string> name="code" placeholder="Code" type="text">
        {fieldRenderProps => <TextInput center={true} {...fieldRenderProps} />}
      </Field>
      <Field<string> name="password" placeholder="New password" type="password">
        {fieldRenderProps => <TextInput center={true} {...fieldRenderProps} />}
      </Field>
      <Field<string>
        name="confirmPassword"
        placeholder="Confirm new password"
        type="password"
      >
        {fieldRenderProps => <TextInput center={true} {...fieldRenderProps} />}
      </Field>
    </div>
    {formRenderProps.submitErrors && (
      <div>
        <span>{formRenderProps.submitErrors.FORM_ERROR}</span>
      </div>
    )}
    <div>
      <button
        type="submit"
        disabled={
          formRenderProps.submitting ||
          formRenderProps.pristine ||
          (formRenderProps.values.password?.length || 0) < PASSWORD_REQUIRED_LENGTH ||
          formRenderProps.values.confirmPassword !== formRenderProps.values.password ||
          (formRenderProps.values.code?.length || 0) === 0 ||
          false
        }
      >
        Submit
      </button>
    </div>
  </form>
);

const AdminChangePasswordForm = (
  formRenderProps: FormRenderProps<ChangePasswordValues, Partial<ChangePasswordValues>>
) => (
  <form onSubmit={formRenderProps.handleSubmit}>
    <div>
      <Field<string>
        name="password"
        placeholder="New password"
        type="password"
        validate={passwordValidator}
      >
        {fieldRenderProps => <TextInput center={true} {...fieldRenderProps} />}
      </Field>
      <Field<string>
        name="confirmPassword"
        placeholder="Confirm new password"
        type="password"
        validate={matchPasswordValidator}
      >
        {fieldRenderProps => <TextInput center={true} {...fieldRenderProps} />}
      </Field>
    </div>
    {formRenderProps.submitErrors && (
      <div>
        <span>{formRenderProps.submitErrors.FORM_ERROR}</span>
      </div>
    )}
    <div>
      <button
        type="submit"
        disabled={
          formRenderProps.submitting ||
          formRenderProps.pristine ||
          (formRenderProps.values.password?.length || 0) < PASSWORD_REQUIRED_LENGTH ||
          formRenderProps.values.confirmPassword !== formRenderProps.values.password ||
          false
        }
      >
        Submit
      </button>
    </div>
  </form>
);

const Login = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  let { path, url } = useRouteMatch();
  const [email, setEmail] = useState("");
  const [userObject, setUserObject] = useState(null);
  const dispatch = useDispatch();

  // actions when user is logged in
  const setLoggedIn = (session: any, email: string, userId: string, admin: boolean) => {
    window.localStorage.setItem(USER_TOKEN_KEY, session.getIdToken().getJwtToken());
    dispatch(userSignIn(email, userId, admin));
    const navState = location.state as NavState;
    if (navState?.referrer) {
      console.log(`Redirecting to referrer ${navState.referrer}`);
      history.replace(navState.referrer);
    } else {
      console.log("Redirecting to home");
      history.replace("/");
    }
  };

  return (
    <div className={classes.centerContainer}>
      <div className={classes.componentContainer}>
        <div className={classes.nibbleLogoContainer}>
          <img
            className={classes.nibbleLogo}
            src={require("../../imgs/nibble-logo.svg")}
            alt="Nibble Logo"
          />
        </div>
        <div className={classes.formContainer}>
          {email.length > 0 && <h3 className={classes.email}>{`Email: ${email}`}</h3>}
          <Switch>
            {/* RESET PASSWORD - AFTER CODE SENT */}
            <Route path={`${path}/reset_code`}>
              <h3>Enter the code from your email</h3>
              <Form
                onSubmit={async (values: NewPasswordValues) => {
                  try {
                    await Auth.forgotPasswordSubmit(
                      email,
                      values.code,
                      values.password
                    );
                    history.replace(`${url}`);
                  } catch (err) {
                    console.log(err);
                    return { FORM_ERROR: err.message };
                  }
                }}
                initialValues={{ code: "", password: "", confirmPassword: "" }}
              >
                {formRenderProps => NewPasswordForm(formRenderProps)}
              </Form>
            </Route>
            {/* RESET PASSWORD - ENTER EMAIL */}
            <Route path={`${path}/reset`}>
              <h3>Reset password</h3>
              <Form
                onSubmit={async (values: ResetValues) => {
                  setEmail(values.email);
                  await Auth.forgotPassword(values.email);
                  history.push(`${url}/reset_code`);
                }}
                initialValues={{ email: "" }}
              >
                {formRenderProps => ResetPasswordForm(formRenderProps)}
              </Form>
            </Route>
            {/* SIGN UP */}
            <Route path={`${path}/signup`}>
              <h1>Welcome to Nibble!</h1>
              <Form
                onSubmit={async (values: SignUpValues) => {
                  try {
                    await Auth.signUp({
                      username: values.email,
                      password: values.password,
                      attributes: {
                        name: values.fullName,
                        email: values.email,
                        "custom:postal_code": values.postalCode,
                        "custom:admin": "false",
                      },
                    });
                    setEmail(values.email);
                    history.push(`${url}/confirm_email`);
                  } catch (err) {
                    console.log(err);
                    return { FORM_ERROR: err.message };
                  }
                }}
              >
                {formRenderProps => SignUpForm(formRenderProps)}
              </Form>
            </Route>
            {/* POST SIGN UP - CONFIRM EMAIL */}
            <Route path={`${path}/confirm_email`}>
              <h3>Enter the code from your email</h3>
              <Form
                onSubmit={async (values: ConfirmEmailValues) => {
                  try {
                    const result = await Auth.confirmSignUp(email, values.code);
                    if (result === "SUCCESS") {
                      // successfully confirmed, now needs to sign in
                      history.push(`${url}`);
                    } else {
                      throw Error("Confirmation did not succeed");
                    }
                  } catch (err) {
                    return { FORM_ERROR: err.message };
                  }
                }}
              >
                {formRenderProps => ConfirmEmailForm(formRenderProps)}
              </Form>
            </Route>
            {/* POST SIGN IN - CREATE NEW PASSWORD (for admins) */}
            <Route path={`${path}/change_password`}>
              <h3>Enter a new password</h3>
              <Form
                onSubmit={async (values: ChangePasswordValues) => {
                  try {
                    const user = await Auth.completeNewPassword(
                      userObject,
                      values.password,
                      {
                        name: email,
                        email: email,
                        "custom:admin": "true", // must be an admin
                      }
                    );
                    console.log(user);
                    const session = await Auth.currentSession();
                    // must have been successful
                    setLoggedIn(
                      session,
                      email,
                      user.username,
                      true // must be an admin
                    );
                  } catch (err) {
                    console.log(err);
                    return { FORM_ERROR: err.message };
                  }
                }}
              >
                {formRenderProps => AdminChangePasswordForm(formRenderProps)}
              </Form>
            </Route>
            {/* LOG IN */}
            <Route exact path={path}>
              <div>
                <Form
                  onSubmit={async (values: LoginValues) => {
                    console.log("Submitted");
                    try {
                      const user = await Auth.signIn(values.email, values.password);
                      console.log(user);
                      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
                        console.log("Giving new password challenge");
                        setUserObject(user);
                        setEmail(values.email);
                        history.push(`${url}/change_password`);
                      }
                      console.log(user);
                      const session = await Auth.currentSession();
                      // must have been successful
                      setLoggedIn(
                        session,
                        values.email,
                        user.username,
                        user.attributes["custom:admin"] === "true" // TODO: fix this
                      );
                    } catch (err) {
                      console.log(err);
                      if (err.code === "UserNotConfirmedException") {
                        setEmail(values.email);
                        await Auth.resendSignUp(values.email);
                        history.push(`${url}/confirm_email`);
                      }
                      return { FORM_ERROR: err.message };
                    }
                  }}
                  initialValues={{ email: email, password: "" }}
                >
                  {formRenderProps => LoginForm(formRenderProps)}
                </Form>
                <div className={classes.forgotPassword}>
                  <Link to={{ pathname: `${url}/signup` }}>Sign up</Link>|
                  <Link to={{ pathname: `${url}/reset` }}>Forgot password?</Link>
                </div>
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Login;
