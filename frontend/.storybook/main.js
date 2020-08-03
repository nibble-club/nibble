module.exports = {
  stories: ["../src/**/*.stories.(ts|tsx|js|jsx)"],
  addons: [
    "@storybook/preset-create-react-app",
    "@storybook/addon-actions/register",
    "@storybook/addon-links",
    "@storybook/addon-viewport/register",
    "@storybook/addon-knobs/register",
  ],
};
