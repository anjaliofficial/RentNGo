import { Schema, model } from "mongoose";

import { IWishlist } from "../types/wishlist.types";

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    equipment: {
      type: Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index(
  {
    user: 1,
    equipment: 1,
  },
  {
    unique: true,
  }
);

export default model<IWishlist>(
  "Wishlist",
  wishlistSchema
);