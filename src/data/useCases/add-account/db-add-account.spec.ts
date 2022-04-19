import {
  DbAddAccount,
  AccountModel,
  AddAccountModel,
  IAddAccountRepository,
  IEncrypter,
} from ".";

type SutTypes = {
  sut: DbAddAccount;
  encrypterStub: IEncrypter;
  addAccountRepositoryStub: IAddAccountRepository;
};
const makeAddAcountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return {
        id: "valid_id_123",
        name: "valid_name",
        email: "valid_email",
        password: "hashed_password",
      };
    }
  }
  return new AddAccountRepositoryStub();
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
  const addAccountRepositoryStub = makeAddAcountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return { sut, encrypterStub, addAccountRepositoryStub };
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
  it("Should call AddAccountRepository with corrct values", () => {
    const { addAccountRepositoryStub } = makeSut();
    const spyOn = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = {
      id: "valid_id",
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };

    addAccountRepositoryStub.add(accountData);
    expect(spyOn).toHaveBeenCalledWith({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    });
  });
});
