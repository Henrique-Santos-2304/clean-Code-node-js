import { HttpRequest, HttpResponse } from "./http";

interface IController {
  handle(httpRequest: HttpRequest): HttpResponse;
}

export { IController };
