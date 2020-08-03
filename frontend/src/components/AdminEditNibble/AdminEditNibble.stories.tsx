import React from "react";

import AdminEditNibble from "./AdminEditNibble";

export default {
  component: AdminEditNibble,
  title: "AdminEditNibble",
  excludeStories: /.*Props$/,
};

export const EditRestaurant = () => <AdminEditNibble />;
