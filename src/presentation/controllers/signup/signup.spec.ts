import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "../../errors";
import {
  IEmailValidator,
  AccountModel,
  IAddAccount,
  AddAccountModel,
} from "./signup-protocols";
import { SignUpController } from "./signup";

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: IEmailValidator;
  addAccountStub: IAddAccount;
}
const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid = (email: string): boolean => true;
  }

  return new EmailValidatorStub();
};

const mockAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    add = async (account: AddAccountModel): Promise<AccountModel> => {
      const { name, password, email } = account;
      return new Promise((resolve) =>
        resolve({
          id: "valid_id",
          name,
          email,
          password,
        })
      );
    };
  }

  return new AddAccountStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = mockAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);

  return { emailValidatorStub, sut, addAccountStub };
};

describe("Signup Controller", () => {
  it("Should return 400 if no name is provided", async () => {
    const sut = makeSut().sut;
    const httpRequest = {
      body: {
        email: "john_doe@email.com",
        password: "john_doe",
        passwordConfirmation: "john_doe",
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });
  it("Should return 400 if no email is provided", async () => {
    const sut = makeSut().sut;
    const httpRequest = {
      body: {
        name: "john_do_name",
        password: "john_doe",
        passwordConfirmation: "john_doe",
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });
  it("Should return 400 if no paswword is provided", async () => {
    const sut = makeSut().sut;
    const httpRequest = {
      body: {
        name: "john_do_name",
        email: "john_doe@email.com",
        passwordConfirmation: "john_doe",
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });
  it("Should return 400 if no password confimation is provided", async () => {
    const sut = makeSut().sut;
    const httpRequest = {
      body: {
        name: "john_do_name",
        email: "john_doe@email.com",
        password: "john_doe",
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });
  it("Should return 400 if no password confimation fails", async () => {
    const sut = makeSut().sut;
    const httpRequest = {
      body: {
        name: "john_do_name",
        email: "john_doe@email.com",
        password: "john_doe",
        passwordConfirmation: "invalid_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError("passwordConfirmation")
    );
  });
  it("Should return 400 if an invalid email is provided", async () => {
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

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError("Email is Invalid")
    );
  });
  it("Should call email validator with correct  email ", async () => {
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

    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  it("Should return 500 if throught error with emailValidator", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: "john_do_name",
        email: "invalid_@email.com",
        password: "john_doe",
        passwordConfirmation: "john_doe",
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new ServerError());
    expect(httpResponse.statusCode).toBe(500);
  });
  it("Should call AddAccount with correct values ", async () => {
    const { sut, addAccountStub } = makeSut();

    const addSpy = jest.spyOn(addAccountStub, "add");

    const httpRequest = {
      body: {
        name: "john_do_name",
        email: "invalid_@email.com",
        password: "john_doe",
        passwordConfirmation: "john_doe",
      },
    };
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: "john_do_name",
      email: "invalid_@email.com",
      password: "john_doe",
    });
  });
  it("Should return 500 if throught error with emailValidator", async () => {
    const { sut, addAccountStub } = makeSut();
    jest
      .spyOn(addAccountStub, "add")
      .mockImplementationOnce(
        async () => new Promise((_, reject) => reject(new Error()))
      );
    const httpRequest = {
      body: {
        name: "john_do_name",
        email: "invalid_@email.com",
        password: "john_doe",
        passwordConfirmation: "john_doe",
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new ServerError());
    expect(httpResponse.statusCode).toBe(500);
  });
  it("Should return 200 with values correct ", async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "john_do_name",
        email: "invalid_@email.com",
        password: "john_doe",
        passwordConfirmation: "john_doe",
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: "valid_id",
      name: "john_do_name",
      email: "invalid_@email.com",
      password: "john_doe",
    });
  });
});
