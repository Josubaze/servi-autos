import { Schema, model, models } from 'mongoose'

const productSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true
    },
    },
    { collection: 'products' },
    {
        timestamps: true    
    })

export default models.Product || model('Product', productSchema )