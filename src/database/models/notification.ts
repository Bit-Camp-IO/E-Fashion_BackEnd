import { Relation } from '@type/database';
import { Document, ResolveTimestamps, Schema, model } from 'mongoose';
import { UserDB } from './user';

export interface NotificationDB
  extends Document,
    ResolveTimestamps<{ createdAt: Date; updatedAt: Date }, { timestamps: true }> {
  title: string;
  body: string;
  imageUrl?: string;
  ntype: string;
  to: Relation<UserDB>;
}

const notificationSchema = new Schema<NotificationDB>(
  {
    title: {
      type: String,
      required: true,
      max: 55,
    },
    body: {
      type: String,
      required: true,
      max: 255,
    },
    imageUrl: String,
    ntype: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      default: 'GENERAL',
      ref: 'User',
    },
  },
  { timestamps: true },
);

notificationSchema.index({ expireAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

const NotificationModel = model('Notification', notificationSchema);
export default NotificationModel;
