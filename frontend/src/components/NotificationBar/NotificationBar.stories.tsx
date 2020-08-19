import React from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import { MessageType } from "../../redux/actions";
import { NotificationBarWithoutConnect } from "./NotificationBar";
import { NotificationBarProps } from "./NotificationBar.types";

export default {
  component: NotificationBarWithoutConnect,
  title: "Utilities/NotificationBar",
  excludeStories: /.*Props$/,
  argTypes: {
    messageType: {
      control: {
        type: "inline-radio",
        options: Object.keys(MessageType),
      },
    },
  },
} as Meta;

const Template: Story<NotificationBarProps> = (args) => (
  <NotificationBarWithoutConnect {...args} />
);
export const SuccessBar = Template.bind({});
SuccessBar.args = {
  message: "Successful operation!",
  messageType: MessageType.Success,
};

export const WarningBar = Template.bind({});
WarningBar.args = {
  message: "You're being warned...",
  messageType: MessageType.Warning,
};

export const ErrorBar = Template.bind({});
ErrorBar.args = {
  message: "Oh no, an error has occurred.",
  messageType: MessageType.Error,
};

export const InfoBar = Template.bind({});
InfoBar.args = {
  message: "For your information, here is some information.",
  messageType: MessageType.Information,
};
