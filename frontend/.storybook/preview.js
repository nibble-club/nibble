import React from "react";
import { addDecorator } from "@storybook/react";
import { appTheme } from "../src/common/theming";
import { addParameters } from "@storybook/client-api";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { MockedProvider } from "@apollo/client/testing";
import { ThemeProvider, createUseStyles } from "react-jss";
import { globalTheme } from "../src/common/theming";
import { Provider } from "react-redux";
import { createStore } from "redux";
import nibbleApp from "../src/redux/reducers";
import { IMAGE_UPLOAD_URL } from "../src/graphql/queries";
import { S3ObjectDestination } from "../src/graphql/generated/types";

addParameters({
  viewport: {
    defaultViewport: "iphonex",
    viewports: INITIAL_VIEWPORTS,
  },
});

const useStyles = createUseStyles(theme => ({
  ...globalTheme(theme),
  app: {},
}));

const Styling = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.app}> {children} </div>;
};

const mocks = [
  {
    request: {
      query: IMAGE_UPLOAD_URL,
      variables: {
        dest: S3ObjectDestination.UserProfilePictures,
      },
    },
    result: {
      data: {
        imageUploadURL: {
          presignedUrl:
            "https://800344761765-dev-adchurch-profile-pics.s3.amazonaws.com/eabb01bd-46be-4b06-a9b1-44a80c9960ff?AWSAccessKeyId=ASIA3UWCD4WSUEFQM6PU&Signature=FhqxZUKKIO2Gj0UjeOLG8q6XKpg%3D&x-amz-acl=public-read&content-type=image%2F%2A&x-amz-security-token=IQoJb3JpZ2luX2VjED4aCXVzLXdlc3QtMiJGMEQCIAq9Ywca7SR%2BkQwx5Re6PhbwGrEeOnfHfqLV%2BEMwlc6qAiB6aptv50R9XUWdsEbVOu5dO3XKxHSd8zFQqGo1WLwPbSruAQj3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDgwMDM0NDc2MTc2NSIM8GGRuzx%2Bxyf4QjA7KsIBceJZKPW6mgiaeeaLwp5w4Z9aa%2Fn8CO%2FQXEbYfqoCJheOYuPrOViYUCI%2FvaDOfYt7lQ8OnJu7n6mJzzjxzNw%2BX5sFwsVxr9JEWnu6MO6%2FNofMGdZXioGWBO%2BJJXadN4EFHwomNLqNu%2FQ6rMJWp%2FQ087mxKNB2KDSIWWIrBQdCzoW%2BF4HhA%2B1Uo5a72szeymKmyU8n6T%2BRpe%2Bl7SMGagLWyxZoOrbH6SvwWEDWJQB%2BeTMbvnhbOex2TBpDMvb5w6P4ed8wr7%2BC%2BQU64QH5GgbTCb6pv030QtMR6tXsU%2Fml0aEHzWY8JNH3%2Bvn%2FWrUk%2FYRB6%2BftunGpwVr0qGkXJsY%2Blg%2FuirFVXWg8STmao32Slv3RwoujI7C%2FZS1nIhKUPbcOrHVR2l4hLKk%2BwMn5qHKyqRt8jma0YR4XFSH6rEyz8YCCYNqh9OzSsP7fJ6Kpltn6874TzjK%2BVi8CT7MAmbmoxzNN0%2FqboebBsv%2FyA37qmQ%2BZDjWmBCcQE2nUkH2pW3a0g1uISGxojW4%2FPoR%2FGHYwI3eSZkhU9HKZx0H6Uha9CBr8VdeAKXTQMvwnBDw%3D&Expires=1595977152",
          destination: {
            bucket: "800344761765-dev-adchurch-profile-pics",
            region: "us-west-2",
            key: "eabb01bd-46be-4b06-a9b1-44a80c9960ff",
          },
        },
      },
    },
  },
];

const Theming = ({ children }) => {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <Provider store={createStore(nibbleApp)}>
        <ThemeProvider theme={appTheme}>
          <Styling> {children} </Styling>
        </ThemeProvider>
      </Provider>
    </MockedProvider>
  );
};

addDecorator(storyFn => <Theming>{storyFn()}</Theming>);
