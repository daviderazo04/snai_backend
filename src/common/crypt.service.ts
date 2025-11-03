import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class CryptService {
  async crypt(content: string): Promise<string> {
    return await argon2.hash(content);
  }

  async compare(plainText: string, hashedText: string): Promise<boolean> {
    return await argon2.verify(hashedText, plainText);
  }
}
