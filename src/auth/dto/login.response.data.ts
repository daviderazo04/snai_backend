import { JwtUser } from '../internalClasses/JWTUser';

export class LoginResponseData {
  constructor(
    public accessToken: string,
    public user: JwtUser,
  ) {}
}
