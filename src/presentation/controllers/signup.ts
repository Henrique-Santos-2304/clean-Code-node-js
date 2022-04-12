import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingParamError } from "../errors/missing-param-erros";
import { ServerError } from "../errors/server-error";
import { badRequest } from "../helper/hel-helper";
import { IController } from "../protocols/controller";
import { IEmailValidator } from "../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../protocols/http";

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

      const isEmailValid = this.emailValidor.isValid(httpRequest.body?.email);
      if (!isEmailValid)
        return badRequest(new InvalidParamError("Email is Invalid"));

      return badRequest(new MissingParamError("No data error"));
    } catch (error) {
      return { statusCode: 500, body: new ServerError() };
    }
  }
}

export { SignUpController };
