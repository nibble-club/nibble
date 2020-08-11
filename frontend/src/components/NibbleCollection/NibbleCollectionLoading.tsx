import React from "react";

import { NibbleCardLoading } from "../NibbleCard";
import { useStyles } from "./NibbleCollection.style";

export const NibbleCollectionLoading = () => {
  const classes = useStyles();

  return (
    <div className={classes.collectionContainer}>
      {[1, 2, 3, 4, 5].map((num) => (
        <NibbleCardLoading key={num} />
      ))}
    </div>
  );
};
