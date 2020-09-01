import React from "react";

import { Meta, Story } from "@storybook/react/types-6-0";

import { NibbleReservationStatus } from "../../graphql/generated/types";
import AdminNibbleReservationCard from "./AdminNibbleReservationCard";
import { AdminNibbleReservationCardProps } from "./AdminNibbleReservationCard.types";

export default {
  component: AdminNibbleReservationCard,
  title: "Admin/AdminNibbleReservationCard",
  excludeStories: /.*Props$/,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    nibbleId: "364",
    count: 3,
    price: 600,
    reservedAt: 1598654214,
    user: {
      userId: "bbe205c6-96ac-462a-b923-ad1c2e307060",
      name: "Andrew C.",
      email: "chu.andrew.8+u1@gmail.com",
      profilePicUrl: {
        bucket: "800344761765-dev-adchurch-profile-pics",
        region: "us-west-2",
        key: "354a1761-00da-4eec-9483-9074849557ba.jpg",
      },
    },
    status: NibbleReservationStatus.Reserved,
    cancelledAt: null,
    cancellationReason: null,
  },
  argTypes: {
    status: {
      control: {
        type: "inline-radio",
        options: Object.keys(NibbleReservationStatus),
      },
    },
  },
} as Meta;

const Template: Story<AdminNibbleReservationCardProps> = (args) => (
  <AdminNibbleReservationCard {...args} />
);

export const Reserved = Template.bind({});
Reserved.args = {};
