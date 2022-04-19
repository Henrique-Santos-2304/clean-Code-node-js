import { IEncrypter } from "src/data/protocols";
import bcrypt from "bcrypt";

class BcryptAdapter implements IEncrypter {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }
  async encrypt(value: string): Promise<string> {
    await bcrypt.hash(value, 12);
    return "hashed_password";
  }
}

export { BcryptAdapter };
