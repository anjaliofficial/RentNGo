import { Schema, model } from "mongoose";

import {
  IBooking,
  BookingStatus,
  PaymentStatus,
  PickupStatus,
  ReturnStatus,
} from "../types/booking.types";

const bookingSchema = new Schema<IBooking>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    equipment: {
      type: Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePerDay: {
      type: Number,
      required: true,
    },

    securityDeposit: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    bookingStatus: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    pickupStatus: {
      type: String,
      enum: Object.values(PickupStatus),
      default: PickupStatus.PENDING,
    },

    returnStatus: {
      type: String,
      enum: Object.values(ReturnStatus),
      default: ReturnStatus.PENDING,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default model<IBooking>(
  "Booking",
  bookingSchema
);