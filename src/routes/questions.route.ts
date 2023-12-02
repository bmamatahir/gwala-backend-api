import { Router } from 'express';
import QuestionsController from '@controllers/questions.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';

class QuestionsRoute implements Routes {
  public path = '/questions';
  public router = Router();
  public questionsController = new QuestionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.questionsController.getAllQuestions);
    this.router.post(`${this.path}`, authMiddleware, this.questionsController.createQuestion);
    this.router.post(`${this.path}/:id/answer`, authMiddleware, this.questionsController.answerQuestion);
    this.router.post(`${this.path}/:id/like`, authMiddleware, this.questionsController.likeQuestion);
  }
}

export default QuestionsRoute;
