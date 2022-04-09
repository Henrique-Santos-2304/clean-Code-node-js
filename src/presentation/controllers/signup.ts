class SignUpController {
  handle(httpReuest: any): any {
    return { statusCode: 400, body: new Error("Missing param: name") };
  }
}

export { SignUpController };
