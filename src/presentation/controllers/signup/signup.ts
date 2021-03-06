import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, okResponse, serverError } from "../../helper/hel-helper";
import {
  IController,
  IEmailValidator,
  HttpRequest,
  HttpResponse,
  IAddAccount,
} from "./signup-protocols";

class SignUpController implements IController {
  private readonly emailValidor: IEmailValidator;
  private readonly addAccount: IAddAccount;
  constructor(emailValidor: IEmailValidator, addAccount: IAddAccount) {
    this.emailValidor = emailValidor;
    this.addAccount = addAccount;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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

      const newAccount = await this.addAccount.add({ password, email, name });
      return okResponse(newAccount);
    } catch (error) {
      return serverError();
    }
  }
}

export { SignUpController };
