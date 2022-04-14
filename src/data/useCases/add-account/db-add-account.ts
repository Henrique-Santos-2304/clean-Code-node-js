import { IEncrypter } from "src/data/protocols/encrypter";
import { AccountModel } from "src/domain/models/addAccount";
import { AddAccountModel, IAddAccount } from "src/domain/useCases/addAccount";

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
