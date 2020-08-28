import React from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import NibbleProperty from "./NibbleProperty";
import { NibblePropertyIcon, NibblePropertyProps } from "./NibbleProperty.types";

export default {
  component: NibbleProperty,
  title: "Nibbles/NibbleProperty",
  excludeStories: /.*Props$/,
  argTypes: {
    icon: {
      control: {
        type: "inline-radio",
        options: Object.keys(NibblePropertyIcon).map(
          // @ts-ignore
          (k) => NibblePropertyIcon[k as any]
        ),
      },
    },
  },
} as Meta;

const Template: Story<NibblePropertyProps> = (args) => <NibbleProperty {...args} />;

export const Ingredients = Template.bind({});
Ingredients.args = {
  icon: NibblePropertyIcon.Ingredients,
  text: "Ingredients",
};

export const Prepared = Template.bind({});
Prepared.args = {
  icon: NibblePropertyIcon.Prepared,
  text: "Prepared",
};

export const Location = Template.bind({});
Location.args = {
  icon: NibblePropertyIcon.Location,
  text: "0.2 miles",
};

export const Time = Template.bind({});
Time.args = {
  icon: NibblePropertyIcon.Time,
  text: "9:00 pm",
};

export const Alert = Template.bind({});
Alert.args = {
  icon: NibblePropertyIcon.Alert,
  text: "Reservation already cancelled",
};
