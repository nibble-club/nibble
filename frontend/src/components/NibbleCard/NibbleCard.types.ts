type Loading = {
  loading: true;
};

export type NibbleCardPropsFull = {
  restaurant: {
    name: string;
    distance: number;
  };
  /**
   * If `pickupTime` is defined, then this Nibble card
   * will only show the pickup time, and not the type/distance
   */
  pickupTime?: string;
  name: string;
  type: "Ingredients" | "Prepared";
  count: number;
  imageUrl: string;
  loading: false;
  key: any;
};

export type NibbleCardProps = NibbleCardPropsFull | Loading;
