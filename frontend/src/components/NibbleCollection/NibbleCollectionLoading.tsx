import React from "react";

import { NibbleCardLoading } from "../NibbleCard";
import { useStyles } from "./NibbleCollection.style";

export const NibbleCollectionLoading = () => {
  const classes = useStyles();

  return (
    <div className={classes.collectionContainer}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
        <NibbleCardLoading key={num} />
      ))}
    </div>
  );
};
