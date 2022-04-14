import {
  IEncrypter,
  AccountModel,
  AddAccountModel,
  IAddAccount,
} from "./index";

class DbAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter;
  constructor(encrypter: IEncrypter) {
    this.encrypter = encrypter;
  }
  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    return new Promise((resolve) =>
      resolve({
        id: "valid_id",
        ...account,
      })
    );
  }
}

export { DbAddAccount };
