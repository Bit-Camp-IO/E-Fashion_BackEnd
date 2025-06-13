import * as fs from 'fs';
import firebase from 'firebase-admin';
// import firebaseConfig from '../../../firebase.json';
import NotificationModel, { NotificationDB } from '@/database/models/notification';
import UserModel from '@/database/models/user';
import { AsyncSafeResult } from '../types';
import Config from '@/config';
import { AppError } from '../errors';

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
    if (fs.existsSync('firebase.json')) {
      const firebaseConfig = JSON.parse(fs.readFileSync('firebase.json', 'utf-8'));
      try {
        firebase.initializeApp({
          credential: firebase.credential.cert(firebaseConfig as firebase.ServiceAccount),
        });
      } catch {
        log.warn('There is no firebase.json file\nSome features will not work.');
        log.warn('You can create one for free at https://console.firebase.google.com/');
        log.warn(
          'For more information, see https://firebase.google.com/docs/web/setup#configure_firebase_web_app',
        );
        log.warn('After creating a firebase.json file, restart the server.');
        return;
      }
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
      throw AppError.unauthorized();
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
