import React from "react";
import { Link, Route } from "react-router-dom";
import StoryRouter from "storybook-react-router";

import NibbleDetail from "./NibbleDetail";

export default {
  component: NibbleDetail,
  title: "NibbleDetail",
  excludeStories: /.*Props$/,
  decorators: [StoryRouter()],
};

const Linker = () => (
  <div>
    <Route path="/nibble/:id" component={NibbleDetail} />
    <Link to="/nibble/123">See nibble</Link>
  </div>
);

export const NibbleDetailPage = () => <Linker />;
