import React from "react";
import { addDecorator } from "@storybook/react";
import { appTheme, muiTheme, globalTheme } from "../src/common/theming/theming";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { MockedProvider } from "@apollo/client/testing";
import { ThemeProvider, createUseStyles } from "react-jss";
import { Provider } from "react-redux";
import { createStore } from "redux";
import nibbleApp from "../src/redux/reducers";
import { BrowserRouter } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core";
import darkTheme from "./darkTheme";
import { mocks } from "./apolloMocks";

const useStyles = createUseStyles((theme) => ({
  ...globalTheme(theme),
  app: {},
}));

const Styling = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.app}> {children} </div>;
};

const Theming = ({ children }) => {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <Provider store={createStore(nibbleApp)}>
        <ThemeProvider theme={appTheme}>
          <MuiThemeProvider theme={muiTheme}>
            <BrowserRouter>
              <Styling> {children} </Styling>
            </BrowserRouter>
          </MuiThemeProvider>
        </ThemeProvider>
      </Provider>
    </MockedProvider>
  );
};

export const parameters = {
  viewport: {
    defaultViewport: "iphonex",
    viewports: INITIAL_VIEWPORTS,
  },
  docs: {
    theme: darkTheme,
  },
};

export const decorators = [(storyFn) => <Theming>{storyFn()}</Theming>];
