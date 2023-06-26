import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: String,
    fullName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
