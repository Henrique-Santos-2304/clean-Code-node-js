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
  constructor(emailValidor: IEmailValidator) {
    this.emailValidor = emailValidor;
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

      if (httpRequest.body?.password !== httpRequest.body?.passwordConfirmation)
        return badRequest(new InvalidParamError("passwordConfirmation"));

      const isEmailValid = this.emailValidor.isValid(httpRequest.body?.email);
      if (!isEmailValid)
        return badRequest(new InvalidParamError("Email is Invalid"));

      return badRequest(new MissingParamError("No data error"));
    } catch (error) {
      return serverError();
    }
  }
}

export { SignUpController };
