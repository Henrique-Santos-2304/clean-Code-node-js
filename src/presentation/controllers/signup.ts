import { MissingParamError } from "../errors/missing-param-erros";
import { badRequest } from "../helper/hel-helper";
import { IController } from "../protocols/controller";
import { HttpRequest, HttpResponse } from "../protocols/http";

class SignUpController implements IController {
  handle(httpRequest: HttpRequest): HttpResponse {
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

    return badRequest(new MissingParamError("No data Params"));
  }
}

export { SignUpController };
