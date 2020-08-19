import React from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import { appTheme } from "../../common/theming/theming";
import SectionHeader from "./SectionHeader";
import { SectionHeaderProps } from "./SectionHeader.types";

export default {
  component: SectionHeader,
  title: "Utilities/SectionHeader",
  excludeStories: /.*Props$/,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    color: { control: "color" },
  },
} as Meta;

const Template: Story<SectionHeaderProps> = (args) => <SectionHeader {...args} />;

export const Featured = Template.bind({});
Featured.args = {
  name: "Featured",
  color: appTheme.color.pink,
};

export const YourNibbles = Template.bind({});
YourNibbles.args = {
  name: "Your Nibbles",
  color: appTheme.color.blue,
};

export const NearYou = Template.bind({});
NearYou.args = {
  name: "Near You",
  color: appTheme.color.text.primary,
};
