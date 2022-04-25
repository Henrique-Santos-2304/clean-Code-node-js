import { HttpRequest, HttpResponse } from "./http";

interface IController {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}

export { IController };
