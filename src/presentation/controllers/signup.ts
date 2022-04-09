import { MissingParamError } from "../errors/missing-param-erros";
import { badRequest } from "../helper/hel-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";

class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name)
      return badRequest(new MissingParamError("name"));

    if (!httpRequest.body.email)
      return badRequest(new MissingParamError("email"));

    return badRequest(new MissingParamError("No data Params"));
  }
}

export { SignUpController };
