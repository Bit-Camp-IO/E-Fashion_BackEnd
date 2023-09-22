import mongoose, { Document, Schema } from 'mongoose';

export interface CollectionDB extends Document {
  title: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  items: {
    title: string;
    description: string;
    image: string;
  }[];
}

const collectionSchema = new Schema<CollectionDB>({
  title: { type: String, required: true, minlength: 3 },
  description: { type: String, minlength: 3 },
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number },
  image: { type: String, required: true },
  items: [
    {
      type: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
      },
      minlength: 1,
    },
  ],
});

const CollectionModel = mongoose.model('Collection', collectionSchema);

export default CollectionModel;
