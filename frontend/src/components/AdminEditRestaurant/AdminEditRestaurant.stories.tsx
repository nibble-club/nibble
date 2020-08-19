import React from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import AdminEditRestaurant from "./AdminEditRestaurant";

export default {
  component: AdminEditRestaurant,
  title: "Admin/AdminEditRestaurant",
  excludeStories: /.*Props$/,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: { onSuccess: { action: "success" } },
} as Meta;

export const EditRestaurant = () => <AdminEditRestaurant />;
