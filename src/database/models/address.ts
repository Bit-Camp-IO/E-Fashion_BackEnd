import mongoose, { Schema } from 'mongoose';

export interface AddressDB extends mongoose.Document {
  isPrimary: boolean;
  longitude: number;
  latitude: number
}

const addressSchema = new Schema<AddressDB>({
  isPrimary: {
    type: Boolean,
    default: false,
  },
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
});

const AddressModel = mongoose.model('Address', addressSchema);
export default AddressModel;
