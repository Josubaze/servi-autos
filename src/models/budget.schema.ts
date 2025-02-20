import { Schema, model, models } from 'mongoose';
import dayjs from 'dayjs';

const budgetSchema = new Schema(
  {
    form: {
      type: {
        num: {
          type: Number,
          required: true,
          unique: true,
        },
        dateCreation: {
          type: Date,
          required: true,
          default: () => new Date(),
        },
        dateExpiration: {
          type: Date,
          required: true,
          default: () => new Date(),
        },
        dateUpdate: {
          type: Date,
          default: null,
        },
        currency: {
          type: String,
          required: true,
        },
        exchangeRate: {
          type: Number,
          required: true,
        },
        nameWorker: {
          type: String,
          required: true,
        },
        emailWorker: {
            type: String,
            required: true,
        },
      },
      required: true,
    },
    company: {
      type: {
        _id: String,
        id_card: String,
        name: String,
        address: String,
        email: String,
        phone: String,
      },
      required: true,
    },
    customer: {
      type: {
        _id: String,
        id_card: String,
        name: String,
        email: String,
        phone: String,
        address: String,
      },
      required: true,
    },
    services: [
      {
        _id: String,
        name: String,
        serviceQuantity: Number,
        servicePrice: Number,
        products: [
          {
            product: {
              _id: String,
              name: String,
              category: String,
              price: Number,
            },
            quantity: Number,
          },
        ],
        totalPrice: Number,
      },
    ],
    description: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    // Nuevas propiedades agregadas
    subtotal: {
      type: Number,
      required: true,
    },
    ivaPercentage: {
      type: Number,
      required: true,
    },
    igtfPercentage: {
      type: Number,
      required: true,
    },
    calculatedIva: {
      type: Number,
      required: true,
    },
    calculatedIgtf: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    totalWithIgft: {
      type: Number,
      required: true,
    },
  },
  {
    collection: 'budgets',
    timestamps: false,
  }
);

export default models.Budget || model('Budget', budgetSchema);
