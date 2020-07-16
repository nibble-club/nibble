import React from "react";

import NibbleProperty from "./NibbleProperty";
import {
  NibblePropertyProps,
  NibblePropertyIcon,
} from "./NibbleProperty.types";

export default {
  component: NibbleProperty,
  title: "NibbleProperty",
  excludeStories: /.*Props$/,
};

export const ingredientsProps: NibblePropertyProps = {
  icon: NibblePropertyIcon.Ingredients,
  text: "Ingredients",
};

export const preparedProps: NibblePropertyProps = {
  icon: NibblePropertyIcon.Prepared,
  text: "Prepared",
};

export const locationProps: NibblePropertyProps = {
  icon: NibblePropertyIcon.Location,
  text: "0.2 miles",
};

export const timeProps: NibblePropertyProps = {
  icon: NibblePropertyIcon.Time,
  text: "9:00 pm",
};

export const Ingredients = () => <NibbleProperty {...ingredientsProps} />;

export const Prepared = () => <NibbleProperty {...preparedProps} />;

export const Location = () => <NibbleProperty {...locationProps} />;

export const Time = () => <NibbleProperty {...timeProps} />;
