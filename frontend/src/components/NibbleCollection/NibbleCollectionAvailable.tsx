import React from "react";
import { Link } from "react-router-dom";

import { NibbleCardAvailable } from "../NibbleCard";
import { useStyles } from "./NibbleCollection.style";
import { NibbleCollectionAvailableProps } from "./NibbleCollectionAvailable.types";

export const NibbleCollectionAvailable = (props: NibbleCollectionAvailableProps) => {
  const classes = useStyles();

  return (
    <div className={classes.collectionContainer}>
      {props.nibbles.map((nibble) => (
        <Link to={{ pathname: `/nibble/${nibble.id}` }}>
          <NibbleCardAvailable {...nibble} key={nibble.id} />
        </Link>
      ))}
    </div>
  );
};
