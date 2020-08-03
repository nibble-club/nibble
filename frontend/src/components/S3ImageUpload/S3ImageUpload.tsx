import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { QueryResult, useQuery } from "@apollo/client";

import {
  ImageUploadUrlQuery,
  QueryImageUploadUrlArgs
} from "../../graphql/generated/types";
import { IMAGE_UPLOAD_URL } from "../../graphql/queries";
import { useStyles } from "./S3ImageUpload.style";
import { S3ImageUploadProps } from "./S3ImageUpload.types";

const S3ImageUpload = ({ destination, setImageLocation }: S3ImageUploadProps) => {
  const classes = useStyles();
  const { loading, error, data, refetch } = useQuery(IMAGE_UPLOAD_URL, {
    variables: { dest: destination },
  }) as QueryResult<ImageUploadUrlQuery, QueryImageUploadUrlArgs>;

  const onUploadStart = useCallback(() => {
    console.log("Upload started");
  }, []);
  const onUploadReady = useCallback(() => {
    console.log("Upload completed");
    if (data?.imageUploadURL.destination !== undefined) {
      console.log("Setting image location");
      setImageLocation(data?.imageUploadURL.destination);
    }
    refetch();
  }, [data, setImageLocation, refetch]);
  const onError = useCallback(() => {
    console.log("Error");
  }, []);

  const onDrop = useCallback(
    async ([pendingImage]) => {
      const destinationUrl = data?.imageUploadURL.presignedUrl || "";
      if (destinationUrl.length === 0) {
        console.log("Upload not ready yet");
        onError();
      }
      onUploadStart();
      const response = await fetch(
        new Request(destinationUrl, {
          method: "PUT",
          body: pendingImage,
          headers: new Headers({
            "Content-Type": "image/jpeg",
            "x-amz-acl": "public-read",
          }),
        })
      );
      if (response.status !== 200) {
        console.log(response);
        onError();
        return;
      }
      onUploadReady();
    },
    [data, onUploadReady, onError, onUploadStart]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/jpeg",
    disabled: loading || error !== undefined,
    onDrop,
    multiple: false,
  });

  return (
    <div {...getRootProps({ className: classes.container, id: "s3-image-upload" })}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop image here</p>
      ) : (
        <p>Drag image here or click to select</p>
      )}
    </div>
  );
};

export default S3ImageUpload;
