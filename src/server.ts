import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import QuestionsRoute from './routes/questions.route';

validateEnv();

const app = new App([new IndexRoute(), new AuthRoute(), new QuestionsRoute()]);

app.listen();
