import { BrandDB } from '@/database/models/brand';
import { Document } from 'mongoose';

export interface BrandData {
  name: string;
  description: string;
  link?: string;
  logo?: string;
}

export interface BrandResult {
  id: string;
  name: string;
  description: string;
  logo: string;
  link: string;
}

export interface BrandDoc extends Document, BrandDB {}
