import moment from "moment";
import React from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import { NibbleReservationStatus, NibbleType } from "../../graphql/generated/types";
import { NibbleCardReserved } from "./NibbleCardReserved";
import { NibbleCardReservedProps } from "./NibbleCardReserved.types";

export default {
  component: NibbleCardReserved,
  title: "Nibbles/NibbleCardReserved",
  excludeStories: /.*Props$/,
  args: {
    id: "3",
    restaurant: {
      id: "123",
      name: "Symphony Sushi",
    },
    name: "Half sushi roll",
    type: NibbleType.Prepared,
    count: 5,
    imageUrl: {
      bucket: "800344761765-dev-adchurch-nibble-images",
      region: "us-west-2",
      key: "seeding/sushi.jpg",
    },
    price: 300,
    availableFrom: moment().subtract(7, "h").unix(),
    availableTo: moment().endOf("hour").unix(),
    status: NibbleReservationStatus.Reserved,
    reservedAt: moment().subtract(3, "h").unix(),
  },
} as Meta;

const Template: Story<NibbleCardReservedProps> = (args) => (
  <NibbleCardReserved {...args} />
);

export const Reserved = Template.bind({});

export const Completed = Template.bind({});
Completed.args = {
  status: NibbleReservationStatus.Completed,
};

export const Cancelled = Template.bind({});
Cancelled.args = {
  status: NibbleReservationStatus.CancelledByUser,
  cancellationReason: "bad",
  cancelledAt: moment.utc().subtract(20, "m").subtract(5, "s").unix(),
};
