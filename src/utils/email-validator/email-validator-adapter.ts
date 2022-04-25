import { IEmailValidator } from "src/presentation/protocols";
import validator from "validator";

class EmailValidatorAdapter implements IEmailValidator {
  isValid(email: string): boolean {
    return validator.isEmail(email);
  }
}

export { EmailValidatorAdapter };
