import { Router } from 'express';
export type InitRouterFunc = (app: Router) => void;

export interface ResponseTemplate<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  error?: {
    code: number;
    message: string;
  };
}
