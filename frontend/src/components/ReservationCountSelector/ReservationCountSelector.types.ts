export type ReservationCountSelectorProps = {
  currentCount: number;
  availableCount: number;
  /** Called with the difference of the change (e.g. -1 or +1) */
  onCountChange: (change: number) => void;
};
