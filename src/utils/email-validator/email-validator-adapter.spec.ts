import { EmailValidatorAdapter } from "./email-validator-adapter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail: (): boolean => true,
}));

const makeSut = (): EmailValidatorAdapter => new EmailValidatorAdapter();

describe("Email Validator Adapter", () => {
  it("Should return false if validator return false", () => {
    const sut = makeSut();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid_email");

    expect(isValid).toBe(false);
  });
  it("Should return true if validator return true", () => {
    const sut = makeSut();
    const isValid = sut.isValid("valid_email@email.com");

    expect(isValid).toBe(true);
  });
  it("Should call validator validator with correct email", () => {
    const sut = makeSut();
    const spyEmailStub = jest.spyOn(validator, "isEmail");
    sut.isValid("valid_email@email.com");

    expect(spyEmailStub).toHaveBeenCalledWith("valid_email@email.com");
  });
});
