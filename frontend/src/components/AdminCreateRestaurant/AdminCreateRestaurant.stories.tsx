import React from "react";

import AdminCreateRestaurant from "./AdminCreateRestaurant";

export default {
  component: AdminCreateRestaurant,
  title: "AdminCreateRestaurant",
  excludeStories: /.*Props$/,
};

export const EditRestaurant = () => <AdminCreateRestaurant />;
