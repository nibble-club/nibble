export type ReservationCountSelectorProps = {
  currentCount: number;
  availableCount: number;
  onCountChange: (change: number) => void;
};
