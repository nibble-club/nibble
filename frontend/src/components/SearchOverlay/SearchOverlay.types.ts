export type SearchOverlayProps = {
  show: boolean;
  /**
   * Used to check if a click was inside header element; if it was, search will not
   * lose focus
   */
  headerRef: React.MutableRefObject<HTMLDivElement | null>;
  maxDistance: number | null;
  setMaxDistance: React.Dispatch<React.SetStateAction<number | null>>;
  pickupAfter: moment.Moment | null;
  setPickupAfter: React.Dispatch<React.SetStateAction<moment.Moment | null>>;
};

export type SelectorBoxProps = {
  children: React.ReactNode;
  label: string;
  value: string;
};
