import mongoose, { Schema } from 'mongoose';

export interface AddressDB extends mongoose.Document {
  city: string;
  state: string;
  postalCode: number;
  isPrimary: boolean;
}

const addressSchema = new Schema<AddressDB>({
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: Number,
    required: true,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
});

const AddressModel = mongoose.model('Address', addressSchema);
export default AddressModel;
