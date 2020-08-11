import React, { useState } from "react";

import NibbleProperty, { NibblePropertyIcon } from "../NibbleProperty";
import S3Image from "../S3Image";
import { useStyles } from "./NibbleCard.style";
import { NibbleCardAvailableProps } from "./NibbleCardAvailable.types";

export const getIconForType = (type: string) => {
  const typeStr = type.toUpperCase();
  if (typeStr === "PREPARED") {
    return NibblePropertyIcon.Prepared;
  } else if (typeStr === "INGREDIENTS") {
    return NibblePropertyIcon.Ingredients;
  } else if (typeStr === "MYSTERY") {
    return NibblePropertyIcon.Mystery;
  } else {
    throw new Error(`Invalid Nibble type ${type}`);
  }
};

export const NibbleCardAvailable = (props: NibbleCardAvailableProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const classes = useStyles({ isHovered, ...props });

  return (
    <div
      className={classes.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <S3Image className={classes.image} location={props.imageUrl} alt={props.name} />
      </div>
      <div className={classes.restaurant}>{props.restaurant.name}</div>
      <div className={classes.name}>{props.name}</div>
      <div>
        <div>
          {props.restaurant.distance && (
            <NibbleProperty
              icon={NibblePropertyIcon.Location}
              text={`${props.restaurant.distance.toFixed(1) || 0} miles`}
            />
          )}
          <NibbleProperty icon={getIconForType(props.type)} text={props.type} />
        </div>
        <div className={classes.remaining}>{props.count}</div>
      </div>
    </div>
  );
};
