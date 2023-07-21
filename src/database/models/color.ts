import mongoose, { Schema } from 'mongoose';

export interface ColorDB {
  name: string;
  hex: string;
  rgb?: string;
}

const colorSchema = new Schema<ColorDB>({
  hex: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  rgb: {
    type: String,
    unique: true,
  },
});

const ColorModel = mongoose.model('Color', colorSchema);
export default ColorModel;
