export type DistanceSelectorProps = {
  min?: number;
  max: number;
  startValue?: number;
  /** Called with updated value of distance */
  onDistanceChange: (distance: number) => void;
};
