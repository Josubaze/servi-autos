import { Schema, model, models } from 'mongoose';

const serviceSchema = new Schema({
  serviceName: {
    type: String,
    required: true,
    trim: true
  },
  productsPrice: {
    type: Number,
    default: 0
  },
  servicePrice: {
    type: Number,
    required: true,
    default: 0
  },
  serviceQuantity: {
    type: Number,
    required: true,
    default: 1
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
}, {
  collection: 'services',
  timestamps: true
});

export default models.Service || model('Service', serviceSchema);
