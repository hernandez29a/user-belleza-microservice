/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';
export interface IUser extends Document{
  displayName: string;
  skinType: string;
  gender: ['M', 'F'];
  email: string;
  password: string;
  age: number;
  rol: string;
  img: string;
  status: boolean;
}
