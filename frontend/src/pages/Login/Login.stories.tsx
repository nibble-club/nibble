import React from "react";
import StoryRouter from "storybook-react-router";

import { Meta } from "@storybook/react/types-6-0";

import Login from "./Login";

export default {
  component: Login,
  title: "Pages/Login",
  excludeStories: /.*Props$/,
  decorators: [StoryRouter()],
} as Meta;

export const LoginMain = () => <Login />;
