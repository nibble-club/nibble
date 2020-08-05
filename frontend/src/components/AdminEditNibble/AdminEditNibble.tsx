import { AnyObject } from "final-form";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { useLazyQuery, useMutation } from "@apollo/client";

import {
  AdminNibbleInput,
  NibbleInfoQuery,
  NibbleInfoQueryVariables,
  NibbleType,
  S3ObjectDestination,
  S3ObjectInput
} from "../../graphql/generated/types";
import { ADMIN_CREATE_NIBBLE, ADMIN_EDIT_NIBBLE } from "../../graphql/mutations";
import { NIBBLE_INFO } from "../../graphql/queries";
import { MessageType, showMessage } from "../../redux/actions";
import FormSection from "../FormSection";
import LabeledInput from "../LabeledInput";
import LoadingForm from "../LoadingForm/LoadingForm";
import LoadingOverlay from "../LoadingOverlay";
import { HERO_PLACEHOLDER } from "../S3Image/S3Image";
import S3ImageUpload from "../S3ImageUpload";
import TextInput from "../TextInput";
import { useStyles } from "./AdminEditNibble.style";
import { AdminEditNibbleProps } from "./AdminEditNibble.types";

interface NibbleDetailValues {
  name: string;
  type: NibbleType;
  count: number;
  imageUrl: S3ObjectInput;
  description?: string;
  price: number;
  availableFrom: moment.Moment;
  availableTo: moment.Moment;
}

const storePrice = (value: string) => {
  if (!value) return 0;
  const onlyDigits = value.replace(/[^\d]/g, "");
  const centValue = parseInt(onlyDigits, 10) || 0;
  return centValue;
};

const showPrice = (centValue: number) => {
  const dollarValue = centValue / 100;
  return `$${dollarValue.toFixed(2)}`;
};

const validateValues = (values: NibbleDetailValues) => {
  const errors: any = {};
  if (!values.name) {
    errors.name = "Required";
  }
  if (!values.count) {
    errors.count = "Required";
  } else {
    if (values.count < 1) {
      errors.count = "Must offer at least 1 Nibble";
    } else if (values.count > 100) {
      errors.count = "Maximum of 100 Nibbles";
    }
  }
  if (!values.type) {
    errors.type = "Required";
  }
  if (values.description && values.description.length > 500) {
    errors.description = "Maximum 500 characters";
  }
  if (typeof values.price === "undefined") {
    errors.price = "Required";
  }
  if (values.availableFrom.isSameOrAfter(values.availableTo)) {
    errors.availableTo = "Nibble must be available for some length of time";
  }
  if (values.availableTo.isBefore()) {
    errors.availableTo = "Nibble must be available until some time in the future";
  }
  return Object.keys(errors).length ? errors : {};
};

const getInitialValues = (data: NibbleInfoQuery | undefined) => {
  return {
    name: data?.nibbleInfo.name || "",
    type: data?.nibbleInfo.type || NibbleType.Ingredients,
    count: data?.nibbleInfo.count || 1,
    description: data?.nibbleInfo.description || "",
    price: data?.nibbleInfo.price || 200,
    availableFrom:
      (data?.nibbleInfo.availableFrom && moment.unix(data?.nibbleInfo.availableFrom)) ||
      moment().startOf("hour").add(1, "hours"),
    availableTo:
      (data?.nibbleInfo.availableTo && moment.unix(data?.nibbleInfo.availableTo)) ||
      moment().startOf("hour").add(5, "hours"),
  };
};

const AdminEditNibble = (props: AdminEditNibbleProps) => {
  let { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [imageLocation, setImageLocation] = useState(HERO_PLACEHOLDER);

  const isCreate = !id || id === "new";

  const [getNibbleInfo, { loading, error, data }] = useLazyQuery<
    NibbleInfoQuery,
    NibbleInfoQueryVariables
  >(NIBBLE_INFO, {
    variables: { nibbleId: id },
  });

  if (!isCreate && !loading && !error && !data) {
    getNibbleInfo();
  }

  useEffect(() => {
    setImageLocation(data?.nibbleInfo.imageUrl || HERO_PLACEHOLDER);
  }, [data]);

  const [createNibble, { loading: createLoading }] = useMutation(ADMIN_CREATE_NIBBLE);
  const [editNibble, { loading: editLoading }] = useMutation(ADMIN_EDIT_NIBBLE);

  const onSubmit = async (values: NibbleDetailValues) => {
    console.log("Submitting...");
    const input: AdminNibbleInput = {
      name: values.name,
      type: values.type,
      count: values.count,
      imageUrl: {
        bucket: imageLocation.bucket,
        region: imageLocation.region,
        key: imageLocation.key,
      },
      availableFrom: values.availableFrom.unix(),
      availableTo: values.availableTo.unix(),
      price: values.price,
      description: values.description,
    };
    try {
      if (isCreate) {
        await createNibble({ variables: { input } });
      } else {
        await editNibble({ variables: { id, input } });
      }
      dispatch(
        showMessage(
          `Successfully ${isCreate ? "created" : "updated"} Nibble!`,
          MessageType.Success
        )
      );
      if (props.onSuccess) {
        props.onSuccess();
      }
      history.push("/admin");
      return {};
    } catch (err) {
      dispatch(showMessage(`Error updating Nibble: ${err.message}`, MessageType.Error));
      console.log(err);
      return { FORM_ERROR: err.message };
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={getInitialValues(data)}
      validate={validateValues}
      initialValuesEqual={(
        vals1: AnyObject | undefined,
        vals2: AnyObject | undefined
      ) => {
        // compare all but timestamps, which may change but we can safely ignore
        return (
          (!vals1 && !vals2) ||
          (vals1?.name === vals2?.name &&
            vals1?.type === vals2?.type &&
            vals1?.count === vals2?.count &&
            vals1?.imageUrl === vals2?.imageUrl &&
            vals1?.description === vals2?.description &&
            vals1?.price === vals2?.price)
        );
      }}
    >
      {(formRenderProps) => (
        <div className={classes.container}>
          <LoadingOverlay show={createLoading || editLoading} />
          {!isCreate && loading ? (
            <LoadingForm />
          ) : (
            <form onSubmit={formRenderProps.handleSubmit}>
              <div className={classes.formContainer}>
                <h2>{isCreate ? "Create a new Nibble" : "Update Nibble"}</h2>
                <FormSection>
                  <h3>Nibble Information</h3>
                  <Field<string> name="name" placeholder="" type="text">
                    {(fieldRenderProps) => (
                      <LabeledInput
                        label={"Nibble Name:"}
                        inputWidth={40}
                        explanation={`Quickly describe exactly what you're offering. For example: "Half sushi roll" or "Hoagie roll". This is the title users will see when browsing Nibbles.`}
                        error={fieldRenderProps.meta.error}
                        showError={
                          fieldRenderProps.meta.touched && fieldRenderProps.meta.error
                        }
                      >
                        <TextInput center={false} {...fieldRenderProps} />
                      </LabeledInput>
                    )}
                  </Field>
                  <Field<string> name="description" placeholder="" type="textarea">
                    {(fieldRenderProps) => (
                      <LabeledInput
                        label={"Description:"}
                        inputWidth={55}
                        explanation={`Describe in more detail what you're offering. This is the description users will see when they click on this Nibble.`}
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
                    label="Type:"
                    error={formRenderProps.errors.type}
                    explanation={"What type of Nibble are you offering?"}
                    showError={
                      formRenderProps.form.getFieldState("type")?.touched &&
                      formRenderProps.errors.type
                    }
                  >
                    <Field<NibbleType>
                      name="type"
                      component="select"
                      className={classes.selectActive}
                    >
                      {Object.keys(NibbleType).map((key) => {
                        return (
                          <option key={key} value={key}>
                            {key}
                          </option>
                        );
                      })}
                    </Field>
                  </LabeledInput>
                  <Field<number>
                    name="count"
                    placeholder=""
                    type="number"
                    parse={(value: string) => parseInt(value, 10) || 0}
                    format={(value: number) => (value && value) || ""}
                  >
                    {(fieldRenderProps) => (
                      <LabeledInput
                        label={"Count:"}
                        inputWidth={30}
                        explanation={`Total number of this Nibble you are offering`}
                        error={fieldRenderProps.meta.error}
                        showError={
                          fieldRenderProps.meta.touched && fieldRenderProps.meta.error
                        }
                      >
                        <TextInput center={false} {...fieldRenderProps} />
                      </LabeledInput>
                    )}
                  </Field>
                  <Field<number>
                    name="price"
                    placeholder="$2.00"
                    type="text"
                    parse={storePrice}
                    format={showPrice}
                  >
                    {(fieldRenderProps) => (
                      <LabeledInput
                        label={"Price:"}
                        inputWidth={20}
                        explanation={`Price per Nibble`}
                        error={fieldRenderProps.meta.error}
                        showError={
                          fieldRenderProps.meta.touched && fieldRenderProps.meta.error
                        }
                      >
                        <TextInput center={false} {...fieldRenderProps} />
                      </LabeledInput>
                    )}
                  </Field>
                  <Field<moment.Moment>
                    name="availableFrom"
                    placeholder=""
                    type="datetime"
                  >
                    {(fieldRenderProps) => (
                      <LabeledInput
                        label={"Available From:"}
                        inputWidth={40}
                        explanation={`When this Nibble becomes available. Time zone: UTC${fieldRenderProps.input.value.format(
                          "Z"
                        )}`}
                        error={fieldRenderProps.meta.error}
                        showError={fieldRenderProps.meta.error}
                      >
                        <TextInput center={false} {...fieldRenderProps} />
                      </LabeledInput>
                    )}
                  </Field>
                  <Field<moment.Moment>
                    name="availableTo"
                    placeholder=""
                    type="datetime"
                  >
                    {(fieldRenderProps) => (
                      <LabeledInput
                        label={"Available Until:"}
                        inputWidth={40}
                        explanation={`When this Nibble must be picked up by. Note that users should be allowed to pick up this Nibble any time between the available from and available to times.`}
                        error={fieldRenderProps.meta.error}
                        showError={fieldRenderProps.meta.error}
                      >
                        <TextInput
                          center={false}
                          datetimeOptions={{ disablePast: true }}
                          {...fieldRenderProps}
                        />
                      </LabeledInput>
                    )}
                  </Field>
                </FormSection>
                <FormSection>
                  <LabeledInput
                    label={"Nibble Image:"}
                    inputWidth={60}
                    explanation="Add an image of your Nibble here. Should be a 3:2 aspect ratio. Feel free to leave the default if this is a Mystery Nibble!"
                    imageToPreview={{
                      location: imageLocation,
                      width: 225,
                      height: 150,
                    }}
                    alignLabelTop={true}
                  >
                    <S3ImageUpload
                      setImageLocation={setImageLocation}
                      destination={S3ObjectDestination.NibbleImages}
                    />
                  </LabeledInput>
                </FormSection>
                <button
                  type="submit"
                  disabled={
                    formRenderProps.hasValidationErrors ||
                    formRenderProps.submitting ||
                    (formRenderProps.hasSubmitErrors &&
                      !formRenderProps.dirtySinceLastSubmit)
                  }
                >
                  {isCreate ? "Create Nibble" : "Save changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </Form>
  );
};

export default AdminEditNibble;
