import React from "react";

import { NibbleCardLoading } from "../NibbleCard";
import { useStyles } from "./NibbleCollection.style";

export const NibbleCollectionLoading = ({ count = 12 }) => {
  const classes = useStyles();

  return (
    <div className={classes.collectionContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <NibbleCardLoading key={index} />
      ))}
    </div>
  );
};
