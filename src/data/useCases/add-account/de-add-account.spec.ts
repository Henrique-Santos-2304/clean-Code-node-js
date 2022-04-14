import { IEncrypter, DbAddAccount } from ".";

type SutTypes = {
  sut: DbAddAccount;
  encrypterStub: IEncrypter;
};

const makeEncrpter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt() {
      return "hashed_password";
    }
  }

  return new EncrypterStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrpter();
  const sut = new DbAddAccount(encrypterStub);

  return { sut, encrypterStub };
};

describe("DbAccount UseCase", () => {
  it("Should call encrypted with correct password", () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };

    sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });
  it("Should throw if encrypted throws", () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockRejectedValueOnce(new Error());
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };

    const promise = sut.add(accountData);
    expect(promise).rejects.toThrow();
  });
});
