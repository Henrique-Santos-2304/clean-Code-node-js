import { IEncrypter } from "src/data/protocols";
import bcrypt from "bcrypt";

class BcryptAdapter implements IEncrypter {
  private readonly salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }
  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }
}

export { BcryptAdapter };
