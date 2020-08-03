import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  QueryResult,
  QueryTuple,
  useLazyQuery,
  useMutation,
  useQuery
} from "@apollo/client";

import {
  AdminRestaurantInput,
  GeocodeAddressQuery,
  GeocodeAddressQueryVariables,
  LatLonInput,
  RestaurantForAdminQuery,
  RestaurantForAdminQueryVariables,
  S3ObjectDestination
} from "../../graphql/generated/types";
import {
  ADMIN_CREATE_RESTAURANT,
  ADMIN_EDIT_RESTAURANT
} from "../../graphql/mutations";
import { GEOCODE_ADDRESS, RESTAURANT_FOR_ADMIN } from "../../graphql/queries";
import { MessageType, showMessage } from "../../redux/actions";
import FormSection from "../FormSection";
import LabeledInput from "../LabeledInput/LabeledInput";
import LoadingForm from "../LoadingForm/LoadingForm";
import LoadingOverlay from "../LoadingOverlay";
import MapView from "../MapView";
import { HERO_PLACEHOLDER, LOGO_PLACEHOLDER } from "../S3Image/S3Image";
import S3ImageUpload from "../S3ImageUpload";
import TextInput from "../TextInput/TextInput";
import {
  MARKETS,
  STATES,
  VALID_STATES_BY_MARKET
} from "./AdminEditRestaurant.constants";
import { useStyles } from "./AdminEditRestaurant.style";

type AdminEditRestaurantProps = {
  onSuccess?: Function;
};

interface RestaurantDetailValues {
  addressStreetAddress: string;
  addressLocality: string;
  addressAdministrativeArea: string;
  addressCountry: string;
  addressPostalCode: string;
  name: string;
  market: string;
  description: string;
  disclaimer?: string;
  /** Used for validating the form with the button, to avoid submitting the entire form */
  noSubmit?: boolean;
}

const getInitialValues = (data: RestaurantForAdminQuery | undefined) => {
  console.log("Getting initial values");
  return {
    addressStreetAddress: data?.restaurantForAdmin.address.streetAddress || "",
    addressLocality: data?.restaurantForAdmin.address.locality || "",
    addressAdministrativeArea:
      data?.restaurantForAdmin.address.administrativeArea || "",
    addressCountry: data?.restaurantForAdmin.address.country || "USA",
    addressPostalCode: data?.restaurantForAdmin.address.postalCode || "",
    name: data?.restaurantForAdmin.name || "",
    market: data?.restaurantForAdmin.market || "",
    description: data?.restaurantForAdmin.description || "",
    disclaimer: data?.restaurantForAdmin.disclaimer || "",
  };
};

const validateValues = (values: RestaurantDetailValues) => {
  const errors: any = {};
  // restaurant info values
  if (!values.name) {
    errors.name = "Required";
  }
  if (!values.market) {
    errors.market = "Required";
  }
  if (!values.description) {
    errors.description = "Required";
  }
  // address values
  if (!values.addressStreetAddress) {
    errors.addressStreetAddress = "Required";
  }
  if (!values.addressLocality) {
    errors.addressLocality = "Required";
  }
  if (!values.addressAdministrativeArea) {
    errors.addressAdministrativeArea = "Required";
  }
  if (!values.addressPostalCode) {
    errors.addressPostalCode = "Required";
  }
  if (
    values.addressPostalCode &&
    (values.addressPostalCode.length !== 5 || !/\d{5}/.test(values.addressPostalCode))
  ) {
    errors.addressPostalCode = "Invalid, please enter a 5 digit postal code";
  }

  // nuanced validation
  if (values.description && values.description.length > 500) {
    errors.description = "Maximum 500 characters";
  }
  if (values.market && values.addressAdministrativeArea) {
    if (
      !(VALID_STATES_BY_MARKET.get(values.market) || []).includes(
        values.addressAdministrativeArea
      )
    ) {
      errors.addressAdministrativeArea = `Invalid state for selected market (${values.market})`;
    }
  }

  return Object.keys(errors).length ? errors : {};
};

const AdminEditRestaurant = (props: AdminEditRestaurantProps) => {
  const classes = useStyles();

  const history = useHistory();

  const dispatch = useDispatch();

  const [logoLocation, setLogoLocation] = useState(LOGO_PLACEHOLDER);
  const [heroLocation, setHeroLocation] = useState(HERO_PLACEHOLDER);

  const { loading, error, data } = useQuery(RESTAURANT_FOR_ADMIN) as QueryResult<
    RestaurantForAdminQuery,
    RestaurantForAdminQueryVariables
  >;

  useEffect(() => {
    setLogoLocation(data?.restaurantForAdmin.logoUrl || LOGO_PLACEHOLDER);
    setHeroLocation(data?.restaurantForAdmin.heroUrl || HERO_PLACEHOLDER);
  }, [data]);

  const [getGeocode, geocodeAddressResult] = useLazyQuery(
    GEOCODE_ADDRESS
  ) as QueryTuple<GeocodeAddressQuery, GeocodeAddressQueryVariables>;

  const isUpdate = !error;

  const restaurantLoc = geocodeAddressResult.data
    ? {
        location: {
          latitude: geocodeAddressResult.data.geocodeAddress.latitude,
          longitude: geocodeAddressResult.data.geocodeAddress.longitude,
        },
      }
    : data
    ? {
        location: {
          latitude: data.restaurantForAdmin.address.location.latitude,
          longitude: data.restaurantForAdmin.address.location.longitude,
        },
      }
    : undefined;

  const [createRestaurant, { loading: createLoading }] = useMutation(
    ADMIN_CREATE_RESTAURANT
  );
  const [editRestaurant, { loading: editLoading }] = useMutation(ADMIN_EDIT_RESTAURANT);

  const onSubmit = async (values: RestaurantDetailValues) => {
    if (values.noSubmit) {
      return;
    }
    const input: AdminRestaurantInput = {
      name: values.name,
      market: values.market,
      description: values.description,
      disclaimer: values.disclaimer,
      address: {
        streetAddress: values.addressStreetAddress,
        locality: values.addressLocality,
        administrativeArea: values.addressAdministrativeArea,
        country: values.addressCountry,
        postalCode: values.addressPostalCode,
        // cannot be null because we must have already validated location
        ...(restaurantLoc as { location: LatLonInput }),
      },
      logoUrl: {
        bucket: logoLocation.bucket,
        region: logoLocation.region,
        key: logoLocation.key,
      },
      heroUrl: {
        bucket: heroLocation.bucket,
        region: heroLocation.region,
        key: heroLocation.key,
      },
      active: true,
    };
    try {
      if (isUpdate) {
        console.log("Editing restaurant...");
        await editRestaurant({ variables: { input } });
      } else {
        console.log("Creating restaurant...");
        await createRestaurant({ variables: { input } });
      }
      console.log("Done updating restaurant");
      dispatch(
        showMessage(
          `Successfully ${isUpdate ? "updated" : "created"} restaurant!`,
          MessageType.Success
        )
      );
      history.push("/admin");
      if (props.onSuccess) {
        props.onSuccess();
      }
      return {};
    } catch (err) {
      dispatch(
        showMessage(`Error updating restaurant: ${err.message}`, MessageType.Error)
      );

      console.log(err);
      return { FORM_ERROR: err.message };
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={getInitialValues(data)}
      validate={validateValues}
    >
      {(formRenderProps) => {
        return (
          <div className={classes.container}>
            <LoadingOverlay show={createLoading || editLoading} />

            {loading ? (
              <LoadingForm />
            ) : (
              <form onSubmit={formRenderProps.handleSubmit}>
                <div className={classes.formContainer}>
                  <h2>
                    {isUpdate
                      ? "Update your restaurant information"
                      : "Create your restaurant"}
                  </h2>

                  <FormSection>
                    <h3>Basic Information</h3>
                    <Field<string> name="name" placeholder="" type="text">
                      {(fieldRenderProps) => (
                        <LabeledInput
                          label={"Restaurant Name:"}
                          inputWidth={40}
                          explanation={
                            "Just your restaurant's name, no description yet"
                          }
                          error={fieldRenderProps.meta.error}
                          showError={
                            fieldRenderProps.meta.touched && fieldRenderProps.meta.error
                          }
                        >
                          <TextInput center={false} {...fieldRenderProps} />
                        </LabeledInput>
                      )}
                    </Field>
                    <LabeledInput
                      label="Market:"
                      explanation={
                        "You will only show up for users in your selected market."
                      }
                      error={formRenderProps.errors.market}
                      showError={
                        formRenderProps.form.getFieldState("market")?.touched &&
                        formRenderProps.errors.market
                      }
                    >
                      <Field
                        name="market"
                        component="select"
                        className={
                          formRenderProps.values.market
                            ? classes.selectActive
                            : classes.select
                        }
                      >
                        <option />
                        {MARKETS.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </Field>
                    </LabeledInput>
                    <Field<string>
                      name="description"
                      placeholder="Give a quick, exciting description of your restaurant"
                      type="textarea"
                    >
                      {(fieldRenderProps) => (
                        <LabeledInput
                          label={"Description:"}
                          inputWidth={50}
                          explanation={
                            "Shown at the top of your restaurant's page - this is your space to shine! Maximum 500 characters."
                          }
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
                      name="disclaimer"
                      placeholder='e.g. "Covid-19 may affect normal operating hours"'
                      type="textarea"
                    >
                      {(fieldRenderProps) => (
                        <LabeledInput
                          label={"Disclaimer:"}
                          inputWidth={50}
                          explanation={
                            "Shown at the bottom of your restaurant's page - tell customers any potentially important information."
                          }
                          error={fieldRenderProps.meta.error}
                          showError={
                            fieldRenderProps.meta.touched && fieldRenderProps.meta.error
                          }
                        >
                          <TextInput center={false} {...fieldRenderProps} />
                        </LabeledInput>
                      )}
                    </Field>
                  </FormSection>

                  <FormSection>
                    <h3>Branding</h3>
                    <LabeledInput
                      label={"Logo:"}
                      inputWidth={60}
                      explanation="Add your restaurant logo here. Should be a square image."
                      imageToPreview={{
                        location: logoLocation,
                        width: 100,
                        height: 100,
                      }}
                      alignLabelTop={true}
                    >
                      <S3ImageUpload
                        setImageLocation={setLogoLocation}
                        destination={S3ObjectDestination.RestaurantLogos}
                      />
                    </LabeledInput>
                    <LabeledInput
                      label={"Hero Image:"}
                      inputWidth={60}
                      explanation="Your restaurant's hero image. Should be 3:2 aspect ratio. This is shown at the top of your restaurant's page."
                      imageToPreview={{
                        location: heroLocation,
                        width: 225,
                        height: 150,
                      }}
                      alignLabelTop={true}
                    >
                      <S3ImageUpload
                        setImageLocation={setHeroLocation}
                        destination={S3ObjectDestination.RestaurantHeros}
                      />
                    </LabeledInput>
                  </FormSection>

                  <FormSection>
                    <h3>Address</h3>
                    <Field<string>
                      name="addressStreetAddress"
                      placeholder="e.g. 820 Post St."
                      type="text"
                    >
                      {(fieldRenderProps) => (
                        <LabeledInput
                          label={"Street Address:"}
                          inputWidth={35}
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
                      name="addressLocality"
                      placeholder="e.g. San Francisco"
                      type="text"
                    >
                      {(fieldRenderProps) => (
                        <LabeledInput
                          label={"City:"}
                          inputWidth={20}
                          error={fieldRenderProps.meta.error}
                          showError={
                            fieldRenderProps.meta.touched && fieldRenderProps.meta.error
                          }
                        >
                          <TextInput center={false} {...fieldRenderProps} />
                        </LabeledInput>
                      )}
                    </Field>
                    <LabeledInput
                      label="State:"
                      error={formRenderProps.errors.addressAdministrativeArea}
                      showError={
                        (formRenderProps.form.getFieldState("addressAdministrativeArea")
                          ?.touched ||
                          formRenderProps.form.getFieldState("market")?.touched) &&
                        formRenderProps.errors.addressAdministrativeArea
                      }
                    >
                      <Field
                        name="addressAdministrativeArea"
                        component="select"
                        className={
                          formRenderProps.values.addressAdministrativeArea
                            ? classes.selectActive
                            : classes.select
                        }
                      >
                        <option />
                        {STATES.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </Field>
                    </LabeledInput>
                    <LabeledInput
                      label="Country:"
                      error={formRenderProps.errors.addressCountry}
                      showError={
                        formRenderProps.form.getFieldState("addressCountry")?.touched &&
                        formRenderProps.errors.addressAdministrativeArea
                      }
                    >
                      <Field
                        name="addressCountry"
                        component="select"
                        className={classes.selectActive}
                      >
                        <option value={"USA"}>USA</option>
                      </Field>
                    </LabeledInput>
                    <Field<string>
                      name="addressPostalCode"
                      placeholder="e.g. 94109"
                      type="text"
                    >
                      {(fieldRenderProps) => (
                        <LabeledInput
                          label={"Postal Code:"}
                          inputWidth={20}
                          explanation={"5 digit ZIP code"}
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
                      type="submit"
                      onClick={() => {
                        console.log("Validating");
                        formRenderProps.form.change("noSubmit", true);
                        const variables: GeocodeAddressQueryVariables = {
                          addr: {
                            streetAddress: formRenderProps.values.addressStreetAddress,
                            locality: formRenderProps.values.addressLocality,
                            administrativeArea:
                              formRenderProps.values.addressAdministrativeArea,
                            country: formRenderProps.values.addressCountry,
                            postalCode: formRenderProps.values.addressPostalCode,
                          },
                        };
                        getGeocode({ variables });
                      }}
                      disabled={
                        formRenderProps.errors.addressStreetAddress ||
                        formRenderProps.errors.addressLocality ||
                        formRenderProps.errors.addressAdministrativeArea ||
                        formRenderProps.errors.addressCountry ||
                        formRenderProps.errors.addressPostalCode
                      }
                    >
                      Validate restaurant location
                    </button>
                    <div>
                      {geocodeAddressResult.error && (
                        <span>{geocodeAddressResult.error.message}</span>
                      )}
                      <MapView
                        pins={
                          restaurantLoc
                            ? [
                                {
                                  address: {
                                    ...restaurantLoc,
                                  },
                                  name:
                                    formRenderProps.values.name ||
                                    data?.restaurantForAdmin.name ||
                                    "Your Restaurant",
                                },
                              ]
                            : []
                        }
                        activePin={restaurantLoc ? 0 : undefined}
                        height={500}
                      />
                    </div>
                  </FormSection>
                  {/* End of address form */}

                  <div>
                    <button
                      type="submit"
                      disabled={
                        formRenderProps.hasValidationErrors ||
                        formRenderProps.submitting ||
                        !(data || geocodeAddressResult.data) ||
                        (formRenderProps.hasSubmitErrors &&
                          !formRenderProps.dirtySinceLastSubmit)
                      }
                      onClick={() => {
                        formRenderProps.form.change("noSubmit", false);
                      }}
                    >
                      {isUpdate ? "Save changes" : "Create restaurant"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        );
      }}
    </Form>
  );
};

export default AdminEditRestaurant;
