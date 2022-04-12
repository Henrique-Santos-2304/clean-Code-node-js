import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingParamError } from "../errors/missing-param-erros";
import { IEmailValidator } from "../protocols/email-validator";
import { SignUpController } from "./signup";

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: IEmailValidator;
}
const makeSut = (): SutTypes => {
  class EmailValidatorStub implements IEmailValidator {
    isValid = (email: string): boolean => true;
  }

  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub);

  return { emailValidatorStub, sut };
};

describe("Signup Controller", () => {
  it("Should return 400 if no name is provided", () => {
    const sut = makeSut().sut;
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
    const sut = makeSut().sut;
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
  it("Should return 400 if no paswword is provided", () => {
    const sut = makeSut().sut;
    const httpRequest = {
      body: {
        name: "john_do_name",
        email: "john_doe@email.com",
        passwordConfirmation: "john_doe",
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });
  it("Should return 400 if no password confimation is provided", () => {
    const sut = makeSut().sut;
    const httpRequest = {
      body: {
        name: "john_do_name",
        email: "john_doe@email.com",
        password: "john_doe",
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });
  it("Should call email validator with correct  email ", () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = {
      body: {
        name: "john_do_name",
        email: "invalid_@email.com",
        password: "john_doe",
        passwordConfirmation: "john_doe",
      },
    };

    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  it("Should return 400 if an invalid email is provided", () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: "john_do_name",
        email: "invalid_@email.com",
        password: "john_doe",
        passwordConfirmation: "john_doe",
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError("Email is Invalid")
    );
  });
});
