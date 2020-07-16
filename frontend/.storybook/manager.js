import { addons } from "@storybook/addons";
import darkTheme from "./darkTheme";
import "storybook-addon-jss-theme/dist/register";

addons.setConfig({
  theme: darkTheme,
});
