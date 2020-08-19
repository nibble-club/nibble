module.exports = {
  stories: ["../src/**/*.stories.@(ts|tsx|js|jsx)"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  addons: [
    "@storybook/preset-create-react-app",
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@storybook/addon-knobs",
  ],
};
