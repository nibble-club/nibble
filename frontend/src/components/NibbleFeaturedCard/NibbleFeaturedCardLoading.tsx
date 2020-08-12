import React from "react";
import ContentLoader from "react-content-loader";
import { useTheme } from "react-jss";

import { AppTheme } from "../../common/theming/theming.types";
import { useStyles } from "./NibbleFeaturedCard.style";

export const NibbleFeaturedCardLoading = () => {
  const classes = useStyles({ imageUrl: "" });
  const appTheme = useTheme() as AppTheme;

  return (
    <div className={classes.container}>
      <ContentLoader
        animate={true}
        backgroundColor={appTheme.color.card[0]}
        foregroundColor={appTheme.color.card[1]}
        speed={2}
        className={classes.loading}
      >
        <rect
          x={0}
          y={0}
          rx={appTheme.rounding.medium}
          ry={appTheme.rounding.medium}
          width="100%"
          height="100%"
        />
      </ContentLoader>
    </div>
  );
};
