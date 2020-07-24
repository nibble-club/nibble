import React from "react";
import { addDecorator } from "@storybook/react";
import { appTheme } from "../src/common/theming";
import { addParameters } from "@storybook/client-api";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { ThemeProvider, createUseStyles } from "react-jss";
import { globalTheme } from "../src/common/theming";
import { Provider } from "react-redux";
import { createStore } from "redux";
import nibbleApp from "../src/redux/reducers";

addParameters({
  viewport: {
    defaultViewport: "iphonex",
    viewports: INITIAL_VIEWPORTS,
  },
});

const useStyles = createUseStyles(theme => ({
  ...globalTheme(theme),
  app: {},
}));

const Styling = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.app}> {children} </div>;
};

const Theming = ({ children }) => {
  return (
    <Provider store={createStore(nibbleApp)}>
      <ThemeProvider theme={appTheme}>
        <Styling> {children} </Styling>
      </ThemeProvider>
    </Provider>
  );
};

addDecorator(storyFn => <Theming>{storyFn()}</Theming>);
