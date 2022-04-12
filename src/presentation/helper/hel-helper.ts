import { ServerError } from "../errors/server-error";
import { HttpResponse } from "../protocols/http";

const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

const serverError = () => ({ statusCode: 500, body: new ServerError() });

const okResponse = (data: any) => ({ statusCode: 200, body: data });

export { badRequest, serverError, okResponse };
