import { cleanEnv, email, port, str, url } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    CLIENT_URL: url(),
    APP_URL: url(),
    EMAIL_FROM: email(),
    EMAIL_HOST: str(),
    EMAIL_PORT: port(),
    EMAIL_USER: str(),
    EMAIL_PASSWORD: str(),
  });
};

export default validateEnv;
