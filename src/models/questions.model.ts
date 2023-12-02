import { Document, Schema, Types, model } from 'mongoose';
import { IUser } from '@/models/users.model';

export interface IQuestion extends Document {
  _id: string;
  title: string;
  content: string;
  userId: Types.ObjectId | IUser;
}

const questionSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const questionModel = model<IQuestion>('Question', questionSchema);

export default questionModel;
