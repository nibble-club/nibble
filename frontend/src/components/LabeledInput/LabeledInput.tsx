import React from "react";

import S3Image from "../S3Image";
import { useStyles } from "./LabeledInput.style";
import { LabeledInputProps } from "./LabeledInput.types";

/**
 * General input, can put anything on right side using children prop. Allows for
 * explanation text, error text, and image previews.
 */
const LabeledInput = (props: LabeledInputProps) => {
  const classes = useStyles({
    inputWidth: props.inputWidth,
    width: props.imageToPreview?.width,
    height: props.imageToPreview?.height,
    alignLabelTop: props.alignLabelTop,
  });
  return (
    <div className={classes.container}>
      <div className={classes.label}>
        <label>{props.label}</label>
      </div>
      <div className={classes.inputContainer}>
        {props.children}
        {props.explanation && (
          <p className={classes.explanation}>{props.explanation}</p>
        )}
        {props.showError && <span className={classes.errorSpan}>{props.error}</span>}
        {props.imageToPreview && (
          <div className={classes.previewContainer}>
            <p>Preview:</p>
            <S3Image
              location={props.imageToPreview.location}
              alt="Uploaded image preview"
              className={classes.imagePreview}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LabeledInput;
