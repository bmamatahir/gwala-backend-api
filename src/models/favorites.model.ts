import { IUser } from '@/models/users.model';
import { Document, Schema, model, Types } from 'mongoose';
import { IQuestion } from './questions.model';

export interface IFavorite extends Document {
  _id: string;
  questionId: Types.ObjectId | IQuestion;
  userId: Types.ObjectId | IUser;
}

const favoriteSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  questionId: { type: Types.ObjectId, ref: 'Question', required: true },
});

const favoriteModel = model<IFavorite>('Favorite', favoriteSchema);

export default favoriteModel;
