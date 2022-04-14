import { EmailValidatorAdapter } from "./emial-validator";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail: (): boolean => true,
}));

describe("Email Validator Adapter", () => {
  it("Should return false if validator return false", () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid_email");

    expect(isValid).toBe(false);
  });
  it("Should return true if validator return true", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("valid_email@email.com");

    expect(isValid).toBe(true);
  });
});
