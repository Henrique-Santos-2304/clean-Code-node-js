import { EmailValidatorAdapter } from "./emial-validator";

describe("Email Validator Adapter", () => {
  it("Should return false if validator return false", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("invalid_email@email.com");

    expect(isValid).toBe(false);
  });
});
