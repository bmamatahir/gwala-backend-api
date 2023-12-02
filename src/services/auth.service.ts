import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { APP_URL, CLIENT_URL, EMAIL_FROM, EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_USER, SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { IUser } from '@/models/users.model';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { randomBytes } from 'crypto';
import { logger } from '@/utils/logger';
import transporter from '@/libs/mail-transporter';

class AuthService {
  public users = userModel;

  public async signup(userData: CreateUserDto): Promise<IUser> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);

    const verificationToken = this.generateVerificationToken();
    const createUserData: IUser = await this.users.create({ ...userData, password: hashedPassword, verificationToken });

    try {
      this.sendVerificationEmail(createUserData.email, verificationToken);
    } catch (error) {
      logger.error(error);
    }

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: IUser }> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is not matching');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, findUser };
  }

  private generateVerificationToken(): string {
    return randomBytes(16).toString('hex');
  }

  private sendVerificationEmail(email: string, verificationToken: string): void {
    const confirmEmailLink = this.createConfirmEmailLink(verificationToken, CLIENT_URL);
    transporter.sendMail(
      {
        from: EMAIL_FROM,
        to: email,
        subject: 'Account Verification | Gwala',
        html: `Click on the following link to verify your account: <a href="${confirmEmailLink}">${confirmEmailLink}</a>`,
      },
      (error, info) => {
        if (error) {
          throw new HttpException(500, error.message);
        }
      },
    );
  }

  private createConfirmEmailLink(verificationToken: string, callback = '/'): string {
    return `${APP_URL}/confirm-email?token=${verificationToken}&callbackURL=${callback}`;
  }

  public async confirmEmail(verificationToken: string): Promise<void> {
    const user = await this.users.findOne({ verificationToken });
    if (!user) throw new HttpException(409, `Token invalid or expired`);

    await user.updateOne({ verificationToken: null, verifiedAt: new Date() });
  }

  public async logout(userData: IUser): Promise<IUser> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    return findUser;
  }

  public createToken(user: IUser): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
