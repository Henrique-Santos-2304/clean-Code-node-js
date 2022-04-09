import { MissingParamError } from "../errors/missing-param-erros";
import { SignUpController } from "./signup";

describe("Signup Controller", () => {
  it("Should return 400 if no name is provided", () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: "john_doe@email.com",
        password: "john_doe",
        passwordConfirmation: "john_doe",
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  it("Should return 400 if no email is provided", () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: "john_do_name",
        password: "john_doe",
        passwordConfirmation: "john_doe",
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });
});
