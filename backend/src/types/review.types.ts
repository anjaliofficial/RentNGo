import { Document, Types } from "mongoose";

export interface IReview extends Document {
  booking: Types.ObjectId;

  reviewer: Types.ObjectId;

  reviewee: Types.ObjectId;

  equipment: Types.ObjectId;

  rating: number;

  comment: string;

  createdAt: Date;

  updatedAt: Date;
}