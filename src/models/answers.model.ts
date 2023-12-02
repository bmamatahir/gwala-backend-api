import { IUser } from '@/models/users.model';
import { Document, Schema, Types, model } from 'mongoose';
import { IQuestion } from './questions.model';

export interface IAnswer extends Document {
  _id: string;
  content: string;
  userId: Types.ObjectId | IUser;
  questionId: Types.ObjectId | IQuestion;
}

const answerSchema = new Schema({
  content: { type: String, required: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  questionId: { type: Types.ObjectId, ref: 'Question', required: true },
});

const answerModel = model<IAnswer>('Answer', answerSchema);

export default answerModel;
