import moment from "moment";
import React from "react";

import {
  NibbleReservationStatus,
  NibbleReservedInfoFragment,
  NibbleType
} from "../../graphql/generated/types";
import NibbleCardReserved from "./NibbleCardReserved";

export default {
  component: NibbleCardReserved,
  title: "Nibble Card - Reserved",
  excludeStories: /.*Props$/,
};

export const symphonySushiReservedProps: NibbleReservedInfoFragment = {
  id: "3",
  restaurant: {
    name: "Symphony Sushi",
  },
  name: "Half sushi roll",
  type: NibbleType.Prepared,
  count: 5,
  imageUrl: {
    bucket: "PLACEHOLDER",
    region: "",
    key: "hero",
  },
  availableFrom: moment
    .utc()
    .subtract(7, "h")
    .unix(),
  availableTo: moment
    .utc()
    .add(1, "h")
    .unix(),
  status: NibbleReservationStatus.Reserved,
  reservedAt: moment
    .utc()
    .subtract(3, "h")
    .unix(),
};

export const symphonySushiCompletedProps: NibbleReservedInfoFragment = {
  ...symphonySushiReservedProps,
  status: NibbleReservationStatus.Completed,
};

export const symphonySushiCancelledProps: NibbleReservedInfoFragment = {
  ...symphonySushiReservedProps,
  status: NibbleReservationStatus.CancelledByUser,
  cancellationReason: "bad",
  cancelledAt: moment
    .utc()
    .subtract(20, "m")
    .subtract(5, "s")
    .unix(),
};

export const SymphonySushiReserved = () => (
  <NibbleCardReserved {...symphonySushiReservedProps} />
);

export const SymphonySushiCompleted = () => (
  <NibbleCardReserved {...symphonySushiCompletedProps} />
);

export const SymphonySushiCancelled = () => (
  <NibbleCardReserved {...symphonySushiCancelledProps} />
);
