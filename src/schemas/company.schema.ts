import { Schema, model, models } from 'mongoose';

const companySchema = new Schema({
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
  address: {
    type: String,
    required: true,
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
  }
}, {
  collection: 'company',  
  timestamps: false 
});

export default models.Company || model('Company', companySchema);
