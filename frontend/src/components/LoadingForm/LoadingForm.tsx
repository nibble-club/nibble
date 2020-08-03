import React from "react";
import ContentLoader from "react-content-loader";
import { useTheme } from "react-jss";

import { AppTheme } from "../../common/theming.types";
import { useStyles } from "./LoadingForm.style";

const LoadingForm = () => {
  const appTheme = useTheme() as AppTheme;
  const classes = useStyles();
  return (
    <div>
      <h2>Loading...</h2>
      {[1, 2].map((_, index) => (
        <div className={classes.loading} key={index.toString()}>
          <ContentLoader
            animate={true}
            backgroundColor={appTheme.color.card[0]}
            foregroundColor={appTheme.color.card[1]}
            speed={2}
          >
            {[1, 2, 3, 4, 5].map((_, index) => (
              <rect
                key={index.toString()}
                x={0}
                y={85 * index}
                rx={appTheme.rounding.medium}
                ry={appTheme.rounding.medium}
                width="100%"
                height={60}
              />
            ))}
          </ContentLoader>
        </div>
      ))}
    </div>
  );
};

export default LoadingForm;
