import { Document, PopulatedDoc, Schema, Types, model } from 'mongoose';
import { IUser } from '@/models/users.model';
import { IAnswer } from './answers.model';

export interface IQuestion extends Document {
  _id: string;
  title: string;
  content: string;
  userId: Types.ObjectId | IUser;
  answers: Types.Array<PopulatedDoc<IAnswer>>;
}

const questionSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
});

const questionModel = model<IQuestion>('Question', questionSchema);

export default questionModel;
