import { NextFunction, Response } from 'express';
import { AnswerQuestionDto, CreateQuestionDto, LikeQuestionDto } from '@dtos/questions.dto';
import questionService from '@services/questions.service';
import userService from '@services/users.service';
import { IQuestion } from '@/models/questions.model';
import { IAnswer } from '@/models/answers.model';
import { IFavorite } from '@/models/favorites.model';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { IUser } from '@/models/users.model';
import transporter from '@/libs/mail-transporter';
import { EMAIL_FROM } from '@/config';

class QuestionController {
  public questionService = new questionService();
  public usersService = new userService();

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

      const findUser: IUser = await this.usersService.findUserById(answeredQuestion.userId.toString());
      this.notifyQuestionAuthor(findUser.email, answeredQuestion.content);

      res.status(200).json({ data: answeredQuestion, message: 'Question answered successfully' });
    } catch (error) {
      next(error);
    }
  };

  private notifyQuestionAuthor = (email: string, answer: string) => {
    transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: 'Question Answered',
      html: `
      <h3>Your question got answered by <pre style="display: inline">"${email}"</pre></h3>
      "${answer}"`,
    });
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
