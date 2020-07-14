import { addDecorator } from '@storybook/react';
import { withThemesProvider } from 'storybook-addon-jss-theme';
import { appTheme } from '../src/common/theming';
import { withResponsiveViews } from 'storybook-addon-responsive-views'



const themes = [{
  name: 'Dark Theme',
  variables: {
    ...appTheme
  }
},
]

addDecorator(withResponsiveViews)
addDecorator(withThemesProvider(themes));