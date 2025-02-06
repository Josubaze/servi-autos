import { Schema, model, models } from "mongoose";

const notificationSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'notifications',
    timestamps: true
  }
);

const Notification = models.Notification || model("Notification", notificationSchema);

export default Notification;
