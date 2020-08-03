import React from "react";

import AdminEditRestaurant from "./AdminEditRestaurant";

export default {
  component: AdminEditRestaurant,
  title: "AdminEditRestaurant",
  excludeStories: /.*Props$/,
};

export const EditRestaurant = () => <AdminEditRestaurant />;
