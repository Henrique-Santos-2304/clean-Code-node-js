import { IEncrypter } from "src/data/protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

describe("DbAccount UseCase", () => {
  it("Should call encrypted with correct password", () => {
    class EncrypterStub implements IEncrypter {
      async encrypt() {
        return "hashed_password";
      }
    }
    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };

    sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });
});
