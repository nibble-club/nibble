import React from "react";
import { Link } from "react-router-dom";

import { NibbleCardReserved } from "../NibbleCard";
import { useStyles } from "./NibbleCollection.style";
import { NibbleCollectionReservedProps } from "./NibbleCollectionReserved.types";

export const NibbleCollectionReserved = (props: NibbleCollectionReservedProps) => {
  const classes = useStyles();

  return (
    <div className={classes.collectionContainer}>
      {props.nibbles.map((nibble) => (
        <Link to={{ pathname: `/nibble/${nibble.id}` }} key={nibble.id}>
          <NibbleCardReserved {...nibble} />
        </Link>
      ))}
    </div>
  );
};
