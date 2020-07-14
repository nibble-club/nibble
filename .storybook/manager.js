import { addons } from '@storybook/addons';
import darkTheme from './darkTheme'
import 'storybook-addon-jss-theme/dist/register';
import 'storybook-addon-responsive-views/register'


addons.setConfig({
  theme: darkTheme,
});