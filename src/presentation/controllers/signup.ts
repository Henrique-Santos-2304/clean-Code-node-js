import { MissingParamError } from "../errors/missing-param-erros";
import { badRequest } from "../helper/hel-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";

class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const fieldsParamRequired = ["name", "email", "password"];

    for (const field of fieldsParamRequired) {
      if (!httpRequest.body[field])
        return badRequest(new MissingParamError(field));
    }

    return badRequest(new MissingParamError("No data Params"));
  }
}

export { SignUpController };
