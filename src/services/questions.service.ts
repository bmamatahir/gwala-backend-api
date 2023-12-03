import { IQuestion as Question } from '@models/questions.model';
import { HttpException } from '@exceptions/HttpException';

import questionModel from '@models/questions.model';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import answerModel, { IAnswer } from '@/models/answers.model';
import favoriteModel, { IFavorite } from '@/models/favorites.model';
import { AnswerQuestionDto, CreateQuestionDto, LikeQuestionDto } from '@/dtos/questions.dto';

class QuestionService {
  public questions = questionModel;
  public answers = answerModel;
  public favorites = favoriteModel;
  public users = userModel;

  public async findAllQuestion(): Promise<Question[]> {
    const questions: Question[] = await this.questions.find({}).populate('answers');
    return questions;
  }

  public async create(questionData: CreateQuestionDto): Promise<Question> {
    if (isEmpty(questionData)) throw new HttpException(400, 'questionData is empty');
    const newQuestion: Question = await this.questions.create(questionData);
    return newQuestion.save();
  }

  public async answer(answerData: AnswerQuestionDto): Promise<IAnswer> {
    if (isEmpty(answerData)) throw new HttpException(400, 'Answer content cannot be empty');

    const question = await this.questions.findById(answerData.questionId);
    if (!question) throw new HttpException(404, 'Question not found');
    const newAnswer = await this.answers.create(answerData);
    question.answers.push(newAnswer._id);
    const answer = newAnswer.save();
    question.save();
    return answer;
  }

  public async like(likeData: LikeQuestionDto): Promise<IFavorite> {
    const question = await this.questions.findById(likeData.questionId);
    if (!question) throw new HttpException(404, 'Question not found');

    const favorite = await this.favorites.findOne(likeData);

    if (favorite) {
      throw new HttpException(400, 'User has already liked this question');
    }

    const newFavorite = await this.favorites.create(likeData);
    return newFavorite.save();
  }
}

export default QuestionService;
