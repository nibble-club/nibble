import { addDecorator } from "@storybook/react";
import { withThemesProvider } from "storybook-addon-jss-theme";
import { appTheme } from "../src/common/theming";
import { addParameters } from "@storybook/client-api";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

addParameters({
  viewport: {
    defaultViewport: "iphonex",
    viewports: INITIAL_VIEWPORTS,
  },
});

const themes = [
  {
    name: "Dark Theme",
    variables: {
      ...appTheme,
    },
  },
];

addDecorator(withThemesProvider(themes));
