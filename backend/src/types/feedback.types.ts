import { Document, Types } from "mongoose";

export interface IEquipmentFeedback extends Document {
  equipment: Types.ObjectId;

  user: Types.ObjectId;

  rating: number;

  comment: string;

  createdAt: Date;

  updatedAt: Date;
}
