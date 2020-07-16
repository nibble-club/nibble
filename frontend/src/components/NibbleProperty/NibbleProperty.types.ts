export enum NibblePropertyIcon {
  // defines value in material icons https://material.io
  Location = "place",
  Prepared = "fastfood",
  Ingredients = "shopping_basket",
  Mystery = "redeem",
  Time = "schedule",
}

export type NibblePropertyProps = {
  icon: NibblePropertyIcon;
  text: string;
};
