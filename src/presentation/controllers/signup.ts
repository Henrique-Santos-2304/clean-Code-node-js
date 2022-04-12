import { IAddAccount } from "../domain/useCases/addAccount";
import { InvalidParamError, MissingParamError } from "../errors";
import { badRequest, serverError } from "../helper/hel-helper";
import {
  IController,
  IEmailValidator,
  HttpRequest,
  HttpResponse,
} from "../protocols";

class SignUpController implements IController {
  private readonly emailValidor: IEmailValidator;
  private readonly addAccount: IAddAccount;
  constructor(emailValidor: IEmailValidator, addAccount: IAddAccount) {
    this.emailValidor = emailValidor;
    this.addAccount = addAccount;
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const fieldsParamRequired = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];

      for (const field of fieldsParamRequired) {
        if (!httpRequest.body[field])
          return badRequest(new MissingParamError(field));
      }
      const { password, passwordConfirmation, email, name } =
        httpRequest.body!!;

      if (password !== passwordConfirmation)
        return badRequest(new InvalidParamError("passwordConfirmation"));

      const isEmailValid = this.emailValidor.isValid(email);
      if (!isEmailValid)
        return badRequest(new InvalidParamError("Email is Invalid"));

      const newAccount = this.addAccount.add({ password, email, name });
      return { statusCode: 200, body: newAccount };
    } catch (error) {
      return serverError();
    }
  }
}

export { SignUpController };
