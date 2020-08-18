import React, { useCallback, useEffect, useRef, useState } from "react";
import ContentLoader from "react-content-loader";
import { Field, Form } from "react-final-form";
import { useTheme } from "react-jss";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { useMutation, useQuery } from "@apollo/client";
import Auth from "@aws-amplify/auth";

import useOutsideClickAlerter from "../../common/hooks/useOutsideClickAlerter";
import { withTransparency } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";
import FormSection from "../../components/FormSection";
import LabeledInput from "../../components/LabeledInput";
import { NibbleCollectionReserved } from "../../components/NibbleCollection";
import S3Image from "../../components/S3Image";
import { PROFILE_PICTURE_PLACEHOLDER } from "../../components/S3Image/S3Image";
import S3ImageUpload from "../../components/S3ImageUpload";
import SectionHeader from "../../components/SectionHeader";
import TextInput from "../../components/TextInput";
import WithOverlay from "../../components/WithOverlay";
import {
  S3Object,
  S3ObjectDestination,
  UserInfo,
  UserInfoNibblesHistoryQuery,
  UserInfoNibblesHistoryQueryVariables
} from "../../graphql/generated/types";
import { UPDATE_USER } from "../../graphql/mutations";
import {
  USER_INFO,
  USER_INFO_NIBBLES_HISTORY,
  USER_INFO_NIBBLES_RESERVED
} from "../../graphql/queries";
import {
  MessageType,
  showMessage,
  userPostalCode,
  userSignOut
} from "../../redux/actions";
import { useStyles } from "./Profile.style";

interface UserInfoValues {
  fullName: string;
  phoneNumber: string | null;
  postalCode: string;
}

const validateValues = (values: UserInfoValues) => {
  const errors: any = {};
  if (!/^\d{5}$/.test(values.postalCode)) {
    // invalid postal code, not 5 digits
    errors.postalCode = "Invalid postal code";
  }
  if (values.fullName.length < 1) {
    errors.fullName = "Please enter a name";
  }
  if (values.phoneNumber && values.phoneNumber.replace(/[^\d]/g, "").length !== 10) {
    errors.phoneNumber = "Invalid phone number";
  }
  return errors;
};

const normalizePhone = (value: string) => {
  if (!value) return value;
  return value.replace(/[^\d]/g, "");
};

const displayPhone = (onlyNums: string) => {
  if (!onlyNums) return onlyNums;
  if (onlyNums.length <= 3) return onlyNums;
  if (onlyNums.length <= 7) return `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3, 7)}`;
  return `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3, 6)}-${onlyNums.slice(6, 10)}`;
};

const Profile = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery<
    UserInfoNibblesHistoryQuery,
    UserInfoNibblesHistoryQueryVariables
  >(USER_INFO_NIBBLES_HISTORY);
  const [updateUserInfo, { loading: updateLoading }] = useMutation(UPDATE_USER, {
    refetchQueries: [
      { query: USER_INFO },
      { query: USER_INFO_NIBBLES_HISTORY },
      { query: USER_INFO_NIBBLES_RESERVED },
    ],
  });
  const [profilePic, setProfilePic] = useState<S3Object>(PROFILE_PICTURE_PLACEHOLDER);
  const dispatch = useDispatch();
  const appTheme = useTheme() as AppTheme;
  const [showForm, setShowForm] = useState(false);
  const onOutsideClickHandler = useCallback(() => {
    setShowForm(false);
  }, []);
  const formRef = useRef<HTMLDivElement | null>(null);
  useOutsideClickAlerter([formRef], onOutsideClickHandler);

  // show alert on error
  useEffect(() => {
    if (error) {
      dispatch(
        showMessage(`Error loading user info: ${error.message}`, MessageType.Error)
      );
    }
  }, [error, dispatch]);

  // set profile pic location on load
  useEffect(() => {
    if (data) {
      setProfilePic(data.userInfo.profilePicUrl);
    }
  }, [data]);

  // update profile picture on new addition
  useEffect(() => {
    if (!data || profilePic.key === PROFILE_PICTURE_PLACEHOLDER.key) {
      return;
    }
    if (data.userInfo.profilePicUrl.key !== profilePic.key) {
      // keys don't match, user must have updated profile picture
      const updateProfilePicture = async () => {
        console.log("Profile picture updated");
        try {
          await updateUserInfo({
            variables: {
              userInfo: {
                fullName: data.userInfo.fullName,
                profilePicUrl: {
                  bucket: profilePic.bucket,
                  region: profilePic.region,
                  key: profilePic.key,
                },
                phoneNumber: data.userInfo.phoneNumber || null,
                postalCode: data.userInfo.postalCode,
              },
            },
          });
        } catch (err) {
          dispatch(showMessage(err.message, MessageType.Error));
        }
      };
      updateProfilePicture();
    }
  }, [data, profilePic, updateUserInfo, dispatch]);

  // callback on form submit
  const onSubmit = useCallback(
    async (values: UserInfoValues) => {
      const userInfo: UserInfo = {
        fullName: values.fullName,
        postalCode: values.postalCode,
        profilePicUrl: {
          bucket: profilePic.bucket,
          region: profilePic.region,
          key: profilePic.key,
        },
        phoneNumber: values.phoneNumber,
      };

      try {
        await updateUserInfo({ variables: { userInfo } });
        dispatch(userPostalCode(values.postalCode));
        dispatch(
          showMessage(
            "Successfully updated profile information!",
            MessageType.Information
          )
        );
        setShowForm(false);
        return {};
      } catch (err) {
        dispatch(showMessage(err.message, MessageType.Error));
        return { FORM_ERROR: err.message };
      }
    },
    [profilePic, dispatch, updateUserInfo]
  );

  return (
    <div className={classes.mainContent}>
      <div className={classes.title}>
        <Link to={{ pathname: "/" }} className={classes.nibbleLogoLink}>
          <img
            className={classes.nibbleLogo}
            src={require("../../imgs/nibble-logo-orange.svg")}
            alt="Nibble Logo"
          />
        </Link>
        <h3>Settings</h3>
      </div>
      <div className={classes.userInfo}>
        <div className={classes.profilePictureContainer}>
          <S3ImageUpload
            setImageLocation={setProfilePic}
            destination={S3ObjectDestination.UserProfilePictures}
          >
            {updateLoading || loading ? (
              <ContentLoader
                animate={true}
                backgroundColor={appTheme.color.card[2]}
                foregroundColor={appTheme.color.card[3]}
                speed={2}
                className={classes.profilePicture}
              >
                <rect x="0" y="0" width="100%" height="100%" />
              </ContentLoader>
            ) : (
              data && (
                <S3Image
                  location={data.userInfo.profilePicUrl}
                  alt={"profile picture"}
                  className={classes.profilePicture}
                />
              )
            )}
          </S3ImageUpload>
          <p className={classes.helperText}>Tap here to update profile picture</p>
        </div>

        <div className={classes.userInfoText}>
          {loading ? (
            <ContentLoader
              animate={true}
              backgroundColor={appTheme.color.green}
              foregroundColor={withTransparency(appTheme.color.text.primary, 0.5)}
              speed={2}
              width={250}
              height={80}
            >
              <rect
                x="0"
                y="0"
                rx={appTheme.rounding.hard}
                ry={appTheme.rounding.hard}
                width="100%"
                height="40px"
              />
              <rect
                x="0"
                y="50"
                rx={appTheme.rounding.hard}
                ry={appTheme.rounding.hard}
                width="100%"
                height="25px"
              />
            </ContentLoader>
          ) : (
            data && (
              <div>
                <h2>{data?.userInfo.fullName}</h2>
                <p>{data?.userInfo.email}</p>
              </div>
            )
          )}
        </div>
      </div>
      <div className={classes.buttons}>
        <Link
          to={{ hash: "" }}
          onClick={() => {
            setShowForm(true);
          }}
        >
          <button>Edit profile</button>
        </Link>
        <Link
          to={{ pathname: "/login", state: { referrer: "/" } }}
          onClick={async () => {
            dispatch(userSignOut());
            await Auth.signOut();
          }}
        >
          <button id={"sign-out"}>Sign out</button>
        </Link>
      </div>
      {data && data.userInfo.nibblesHistory.length > 0 && (
        <div className={classes.nibbleHistory}>
          <SectionHeader name="Nibble History" color={appTheme.color.text.primary} />
          <NibbleCollectionReserved nibbles={data?.userInfo.nibblesHistory} />
        </div>
      )}
      <div className={classes.attribution}>
        <h3>
          Made with{" "}
          <span role="img" aria-label="heart">
            ❤️
          </span>{" "}
          by
        </h3>
        <img
          className={classes.bottomNibbleLogo}
          src={require("../../imgs/nibble-logo-orange.svg")}
          alt="Nibble Logo"
        />
      </div>
      <WithOverlay show={showForm}>
        {data && (
          <div ref={formRef}>
            <Form
              onSubmit={onSubmit}
              initialValues={{
                fullName: data.userInfo.fullName,
                phoneNumber: data.userInfo.phoneNumber,
                postalCode: data.userInfo.postalCode,
              }}
              validate={validateValues}
            >
              {(formRenderProps) => (
                <form onSubmit={formRenderProps.handleSubmit}>
                  <FormSection padding margin={false}>
                    <Field<string> name="fullName" placeholder="" type="text">
                      {(fieldRenderProps) => (
                        <LabeledInput
                          label={"Full name:"}
                          inputWidth={40}
                          explanation={`Enter your full name`}
                          error={fieldRenderProps.meta.error}
                          showError={
                            fieldRenderProps.meta.touched && fieldRenderProps.meta.error
                          }
                        >
                          <TextInput center={false} {...fieldRenderProps} />
                        </LabeledInput>
                      )}
                    </Field>
                    <Field<string> name="postalCode" placeholder="" type="text">
                      {(fieldRenderProps) => (
                        <LabeledInput
                          label={"Postal code:"}
                          inputWidth={40}
                          explanation={`Enter your 5-digit postal code`}
                          error={fieldRenderProps.meta.error}
                          showError={
                            fieldRenderProps.meta.touched && fieldRenderProps.meta.error
                          }
                        >
                          <TextInput center={false} {...fieldRenderProps} />
                        </LabeledInput>
                      )}
                    </Field>
                    <Field<string>
                      name="phoneNumber"
                      placeholder=""
                      type="text"
                      parse={normalizePhone}
                      format={displayPhone}
                    >
                      {(fieldRenderProps) => (
                        <LabeledInput
                          label={"Phone number:"}
                          inputWidth={40}
                          explanation={`Enter your US phone number`}
                          error={fieldRenderProps.meta.error}
                          showError={
                            fieldRenderProps.meta.touched && fieldRenderProps.meta.error
                          }
                        >
                          <TextInput center={false} {...fieldRenderProps} />
                        </LabeledInput>
                      )}
                    </Field>
                    <button
                      className={classes.submitButton}
                      type="submit"
                      disabled={
                        formRenderProps.hasValidationErrors ||
                        formRenderProps.submitting ||
                        (formRenderProps.hasSubmitErrors &&
                          !formRenderProps.dirtySinceLastSubmit)
                      }
                    >
                      Save changes
                    </button>
                  </FormSection>
                </form>
              )}
            </Form>
          </div>
        )}
      </WithOverlay>
    </div>
  );
};

export default Profile;
