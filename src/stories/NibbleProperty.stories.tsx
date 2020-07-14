import React from 'react';

import NibbleProperty from '../components/NibbleProperty'
import { NibblePropertyProps } from '../types/props';
import { NibblePropertyIcon } from '../types/enums';
import { appTheme } from '../common/theming';




export default {
  component: NibbleProperty,
  title: 'NibbleProperty',
  excludeStories: /.*Data$/,
}

export const ingredients: NibblePropertyProps = {
  icon: NibblePropertyIcon.Ingredients,
  text: 'Ingredients',
  color: appTheme.color.blue,
}

export const prepared: NibblePropertyProps = {
  icon: NibblePropertyIcon.Prepared,
  text: 'Prepared',
  color: appTheme.color.pink
}

export const location: NibblePropertyProps = {
  icon: NibblePropertyIcon.Location,
  text: '0.2 miles',
  color: appTheme.color.green
}

export const time: NibblePropertyProps = {
  icon: NibblePropertyIcon.Time,
  text: '9:00 pm',
  color: appTheme.color.blue
}

export const Ingredients = () => (<NibbleProperty {...ingredients} />)

export const Prepared = () => (<NibbleProperty {...prepared} />)

export const Location = () => (<NibbleProperty {...location} />)

export const Time = () => (<NibbleProperty {...time} />)