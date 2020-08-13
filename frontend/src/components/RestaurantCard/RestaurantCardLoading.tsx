import React from "react";
import ContentLoader from "react-content-loader";
import { useTheme } from "react-jss";

import { multipleClasses } from "../../common/theming/theming";
import { AppTheme } from "../../common/theming/theming.types";
import { cardPadding, useStyles } from "./RestaurantCard.style";

export const RestaurantCardLoading = () => {
  const classes = useStyles({ imageUrl: "" });
  const appTheme = useTheme() as AppTheme;

  return (
    <div className={multipleClasses([classes.container, classes.link])}>
      <ContentLoader
        animate={true}
        backgroundColor={appTheme.color.card[0]}
        foregroundColor={appTheme.color.card[1]}
        speed={2}
        className={classes.loading}
      >
        <rect
          x={cardPadding(appTheme)}
          y={cardPadding(appTheme)}
          rx={appTheme.rounding.medium}
          ry={appTheme.rounding.medium}
          width={140}
          height={35}
        />
        <rect
          x={cardPadding(appTheme)}
          y={`calc(${cardPadding(appTheme)} + 42px)`}
          rx={appTheme.rounding.medium}
          ry={appTheme.rounding.medium}
          width={160}
          height={20}
        />
        <rect
          className={classes.loadingPicture}
          rx={appTheme.rounding.medium}
          ry={appTheme.rounding.medium}
        />
      </ContentLoader>
    </div>
  );
};
