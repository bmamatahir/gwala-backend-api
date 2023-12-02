import { NextFunction, Response } from 'express';
import { AnswerQuestionDto, CreateQuestionDto, LikeQuestionDto } from '@dtos/questions.dto';
import questionService from '@services/questions.service';
import { IQuestion } from '@/models/questions.model';
import { IAnswer } from '@/models/answers.model';
import { IFavorite } from '@/models/favorites.model';
import { RequestWithUser } from '@/interfaces/auth.interface';

class QuestionController {
  public questionService = new questionService();

  public getAllQuestions = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const allQuestions: IQuestion[] = await this.questionService.findAllQuestion();
      res.status(200).json({ data: allQuestions, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public createQuestion = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const questionData: CreateQuestionDto = {
        ...req.body,
        userId: req.user._id,
      };
      const createdQuestion: IQuestion = await this.questionService.create(questionData);

      res.status(201).json({ data: createdQuestion, message: 'Question created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public answerQuestion = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const requestData: AnswerQuestionDto = {
        ...req.body,
        questionId: req.params.id,
        userId: req.user._id,
      };
      const answeredQuestion: IAnswer = await this.questionService.answer(requestData);
      res.status(200).json({ data: answeredQuestion, message: 'Question answered successfully' });
    } catch (error) {
      next(error);
    }
  };

  public likeQuestion = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const requestData: LikeQuestionDto = {
        ...req.body,
        questionId: req.params.id,
        userId: req.user._id,
      };

      const favoriteRecord: IFavorite = await this.questionService.like(requestData);

      res.status(200).json({ data: favoriteRecord, message: 'Question liked successfully' });
    } catch (error) {
      next(error);
    }
  };
}

export default QuestionController;
