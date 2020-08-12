import React from "react";

import { getIconForType } from "../NibbleCard/NibbleCardAvailable";
import NibbleProperty, { NibblePropertyIcon } from "../NibbleProperty";
import { getS3ImageUrl } from "../S3Image/S3Image";
import { useStyles } from "./NibbleFeaturedCard.style";
import { NibbleFeaturedCardProps } from "./NibbleFeaturedCard.types";

export const NibbleFeaturedCard = (props: NibbleFeaturedCardProps) => {
  const imageUrl = getS3ImageUrl(props.imageUrl);
  const classes = useStyles({ imageUrl, count: props.count });

  return (
    <div className={classes.container}>
      <p className={classes.count}>{props.count}</p>
      <div className={classes.properties}>
        {props.restaurant.distance && (
          <div className={classes.property}>
            <NibbleProperty
              icon={NibblePropertyIcon.Location}
              text={`${props.restaurant.distance.toFixed(1) || 0} miles`}
            />
          </div>
        )}
        <div className={classes.property}>
          <NibbleProperty icon={getIconForType(props.type)} text={props.type} />
        </div>
      </div>
      <div className={classes.description}>
        <p id="restaurant">{props.restaurant.name}</p>
        <p id="name">{props.name}</p>
      </div>
      <div className={classes.icon}>
        <i className="material-icons-outlined">grade</i>
      </div>
    </div>
  );
};
