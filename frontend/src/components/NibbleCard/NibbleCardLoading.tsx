import React, { useState } from "react";
import ContentLoader from "react-content-loader";
import { useTheme } from "react-jss";

import { AppTheme } from "../../common/theming/theming.types";
import {
  cardPadding,
  cardWidthFourCards,
  cardWidthThreeCards,
  cardWidthTwoCards,
  useLoadingStyles
} from "./NibbleCard.style";

export const NibbleCardLoading = () => {
  const appTheme = useTheme() as AppTheme;
  const [isHovered, setIsHovered] = useState(false);

  const classes = useLoadingStyles(isHovered);
  // needs to match media queries in NibbleCard.style.ts
  let cardWidth = cardWidthFourCards;
  if (window.innerWidth < 620) {
    cardWidth = cardWidthTwoCards;
  } else if (window.innerWidth < 800) {
    cardWidth = cardWidthThreeCards;
  }
  const imageHeight = `calc((${cardWidth} + 2 * ${cardPadding}) * 2/3)`;
  return (
    <div
      className={classes.container}
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
