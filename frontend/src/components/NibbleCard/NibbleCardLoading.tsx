import React, { useState } from "react";
import ContentLoader from "react-content-loader";

import { appTheme } from "../../common/theming";
import { cardPadding, cardWidth, useLoadingStyles } from "./NibbleCard.style";

const NibbleCardLoading = () => {
  const [isHovered, setIsHovered] = useState(false);

  const classes = useLoadingStyles(isHovered);
  const imageHeight = `calc((${cardWidth} + 2 * ${cardPadding}) * 2/3)`;
  return (
    <div
      className={classes.loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ContentLoader
        animate={true}
        backgroundColor={appTheme.color.card[0]}
        foregroundColor={appTheme.color.card[1]}
        speed={2}
      >
        <rect
          x="0"
          y="0"
          rx={appTheme.rounding.medium}
          ry={appTheme.rounding.medium}
          width="100%"
          height={imageHeight}
        />
        <rect
          x={cardPadding}
          y={`calc(${imageHeight} + ${cardPadding})`}
          rx={appTheme.rounding.hard}
          ry={appTheme.rounding.hard}
          width="40%"
          height={appTheme.fontSizes.small}
        />
        <rect
          x={cardPadding}
          y={`calc(${imageHeight} + ${cardPadding} + 25px)`}
          rx={appTheme.rounding.hard}
          ry={appTheme.rounding.hard}
          width="70%"
          height={appTheme.fontSizes.large}
        />
      </ContentLoader>
    </div>
  );
};

export default NibbleCardLoading;
