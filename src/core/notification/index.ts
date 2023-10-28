import firebase from 'firebase-admin';
import firebaseConfig from '../../../firebase.json';
import NotificationModel, { NotificationDB } from '@/database/models/notification';
import UserModel from '@/database/models/user';
import { AsyncSafeResult } from '@type/common';
import Config from '@/config';

export enum NotificationType {
  GENERAL = 'GENERAL',
  NEW_MESSAGE = 'NEW_MESSAGE',
  STATUS_ORDER = 'STATUS_ORDER',
}

export const AllUsers = NotificationType.GENERAL;

export interface NotificationMessage {
  title: string;
  body: string;
  imageUrl?: string;
}
type NotificationResponse = NotificationMessage & { type: NotificationType };

class Notification {
  constructor(private type: NotificationType, private to: string) {}

  static init() {
    try {
      firebase.initializeApp({
        credential: firebase.credential.cert(firebaseConfig as firebase.ServiceAccount),
      });
    } catch {
      return;
    }
  }

  async push(message: NotificationMessage): Promise<boolean> {
    try {
      await this.create(message);
      if (this.to === AllUsers) {
        await this.pushForAll(message);
        return true;
      } else {
        await this.pushForUser(message);
      }
      return true;
    } catch {
      return false;
    }
  }

  async getAll(): AsyncSafeResult<NotificationResponse[]> {
    try {
      const notiy = await NotificationModel.find({ to: { $in: [this.to, AllUsers] } }).sort({
        createdAt: 1,
      });
      const response = notiy.map(n => ({
        type: n.ntype as NotificationType,
        title: n.title,
        body: n.body,
        imageUrl: n.imageUrl,
        date: n.createdAt,
      }));
      return { result: response, error: null };
    } catch (error) {
      return { error, result: null };
    }
  }

  private async create(message: NotificationMessage): Promise<NotificationDB> {
    if (this.type === NotificationType.NEW_MESSAGE) {
      await NotificationModel.findOneAndDelete({
        to: this.to,
        ntype: this.type,
      });
    }
    return await NotificationModel.create({
      ...message,
      to: this.to,
      ntype: this.type,
    });
  }

  private async pushForAll(message: NotificationMessage) {
    let notification: NotificationMessage | undefined = undefined;
    if (Config.Default_Notification) {
      notification = message;
    }
    await firebase.messaging().send({
      topic: this.to,
      notification: notification,
      data: {
        type: this.type,
        ...message,
      },
    });
  }
  private async pushForUser(message: NotificationMessage) {
    const user = await UserModel.findById(this.to);
    if (!user) {
      throw new Error();
    }
    let notification: NotificationMessage | undefined = undefined;
    if (Config.Default_Notification) {
      notification = message;
    }
    await firebase.messaging().sendEachForMulticast({
      tokens: user.devices,
      notification: notification,
      data: {
        type: this.type,
        ...message,
      },
    });
  }
}

Notification.init();

export default Notification;
