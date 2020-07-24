import fetchMock from 'fetch-mock';
import React from 'react';
import StoryRouter from 'storybook-react-router';

import { action } from '@storybook/addon-actions';

import Login from './Login';

export default {
  component: Login,
  title: "Login",
  excludeStories: /.*Props$/,
  decorators: [StoryRouter()],
};

export const LoginProps: any = {
  setLoggedIn: action("logged-in"),
};

export const LoginMain = () => <Login {...LoginProps} />;
