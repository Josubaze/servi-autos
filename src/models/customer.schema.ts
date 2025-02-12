import { Schema, model, models } from 'mongoose'

const customerSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    id_card: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    }
}, {
    collection: 'customers',
    timestamps: true
});

export default models.Customer || model('Customer', customerSchema);
