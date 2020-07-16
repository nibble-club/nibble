import React, { useState } from "react";
import { NibbleCardProps } from "./NibbleCard.types";
import NibbleProperty from "../NibbleProperty";
import { NibblePropertyIcon } from "../NibbleProperty";
import NibbleCardLoading from "./NibbleCardLoading";
import { useStyles } from "./NibbleCard.style";

const getIconForType = (type: string) => {
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

const NibbleCard = (props: NibbleCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const classes = useStyles({ isHovered, ...props });

  return props.loading ? (
    <div
      className={classes.loadingContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NibbleCardLoading isHovered={isHovered} />
    </div>
  ) : (
    <div
      className={classes.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <img className={classes.image} src={props.imageUrl} alt={props.name} />
      </div>
      <div className={classes.restaurant}>{props.restaurant.name}</div>
      <div className={classes.name}>{props.name}</div>
      <div>
        {props.pickupTime ? (
          <div>
            <div className={classes.pickupBy}>Pickup by:</div>
            <div className={classes.pickupByTime}>{props.pickupTime}</div>
          </div>
        ) : (
          <div>
            <div className={classes.children}>
              <NibbleProperty
                icon={NibblePropertyIcon.Location}
                text={`${props.restaurant.distance} miles`}
              />
            </div>
            <div className={classes.children}>
              <NibbleProperty
                icon={getIconForType(props.type)}
                text={props.type}
              />
            </div>
          </div>
        )}
        <div className={classes.remaining}>{props.count}</div>
      </div>
    </div>
  );
};

export default NibbleCard;
