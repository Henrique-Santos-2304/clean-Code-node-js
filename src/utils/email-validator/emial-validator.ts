import { IEmailValidator } from "src/presentation/protocols";

class EmailValidatorAdapter implements IEmailValidator {
  isValid(email: string): boolean {
    return false;
  }
}

export { EmailValidatorAdapter };
