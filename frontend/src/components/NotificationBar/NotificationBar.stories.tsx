import React from "react";

import { text, withKnobs } from "@storybook/addon-knobs";

import { MessageType } from "../../redux/actions";
import { NotificationBarWithoutConnect } from "./NotificationBar";

export default {
  component: NotificationBarWithoutConnect,
  title: "NotificationBar",
  excludeStories: /.*Props$/,
  decorators: [withKnobs],
  parameters: {
    knobs: {
      escapeHTML: false,
    },
  },
};

export const SuccessBar = () => (
  <NotificationBarWithoutConnect
    message={text("Message", "Successful operation!")}
    messageType={MessageType.Success}
  />
);

export const WarningBar = () => (
  <NotificationBarWithoutConnect
    message={text("Message", "You're being warned...")}
    messageType={MessageType.Warning}
  />
);

export const ErrorBar = () => (
  <NotificationBarWithoutConnect
    message={text("Message", "Oh no, an error has occurred.")}
    messageType={MessageType.Error}
  />
);

export const InfoBar = () => (
  <NotificationBarWithoutConnect
    message={text("Message", "For your information, here is some information.")}
    messageType={MessageType.Information}
  />
);
