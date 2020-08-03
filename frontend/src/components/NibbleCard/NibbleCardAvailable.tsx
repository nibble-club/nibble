import React, { useState } from "react";

import { NibbleAvailableInfoFragment } from "../../graphql/generated/types";
import NibbleProperty, { NibblePropertyIcon } from "../NibbleProperty";
import S3Image from "../S3Image";
import { useStyles } from "./NibbleCard.style";

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

export const NibbleCardAvailable = (
  props: NibbleAvailableInfoFragment & {
    restaurantName: string;
    restaurantDistance?: number;
  }
) => {
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
      <div className={classes.restaurant}>{props.restaurantName}</div>
      <div className={classes.name}>{props.name}</div>
      <div>
        <div>
          <div className={classes.children}>
            {props.restaurantDistance && (
              <NibbleProperty
                icon={NibblePropertyIcon.Location}
                text={`${props.restaurantDistance || 0} miles`}
              />
            )}
          </div>
          <div className={classes.children}>
            <NibbleProperty icon={getIconForType(props.type)} text={props.type} />
          </div>
        </div>
        <div className={classes.remaining}>{props.count}</div>
      </div>
    </div>
  );
};
