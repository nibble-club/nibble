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
        <Link to={{ pathname: `/restaurant/${nibble.restaurant.id}` }}>
          <NibbleCardReserved {...nibble} key={nibble.id} />
        </Link>
      ))}
    </div>
  );
};
