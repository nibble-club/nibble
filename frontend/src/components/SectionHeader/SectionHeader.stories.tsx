import React from "react";

import { appTheme } from "../../common/theming";
import SectionHeader from "./SectionHeader";

export default {
  component: SectionHeader,
  title: "SectionHeader",
  excludeStories: /.*Props$/,
};

export const FeaturedProps = {
  name: "Featured",
  color: appTheme.color.pink,
};

export const YourNibblesProps = {
  name: "Your Nibbles",
  color: appTheme.color.blue,
};

export const NearYouProps = {
  name: "Near You",
  color: appTheme.color.text.primary,
};

export const Featured = () => <SectionHeader {...FeaturedProps} />;

export const YourNibbles = () => <SectionHeader {...YourNibblesProps} />;

export const NearYou = () => <SectionHeader {...NearYouProps} />;
