import React from "react";

import NibbleProperty, { NibblePropertyIcon } from "../NibbleProperty";
import S3Image from "../S3Image";
import { useStyles } from "./RestaurantCard.style";
import { RestaurantCardProps } from "./RestaurantCard.types";

const RestaurantCard = (props: RestaurantCardProps) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.overflowContainer}>
        <h3 className={classes.name}>{props.name}</h3>
        <p className={classes.address}>{props.address.streetAddress}</p>
      </div>
      <div className={classes.propertiesContainer}>
        <NibbleProperty
          icon={NibblePropertyIcon.Location}
          text={`${props.distance.toFixed(1) || 0} miles`}
        />
      </div>
      <S3Image className={classes.logo} location={props.logoUrl} alt={props.name} />
    </div>
  );
};

export default RestaurantCard;
