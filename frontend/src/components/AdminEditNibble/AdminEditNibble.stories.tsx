import React from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import AdminEditNibble from "./AdminEditNibble";
import { AdminEditNibbleProps } from "./AdminEditNibble.types";

export default {
  component: AdminEditNibble,
  title: "Admin/AdminEditNibble",
  excludeStories: /.*Props$/,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: { onSuccess: { action: "success" } },
} as Meta;

export const EditNibble: Story<AdminEditNibbleProps> = () => <AdminEditNibble />;
