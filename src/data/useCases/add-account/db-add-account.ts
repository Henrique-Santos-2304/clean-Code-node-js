import {
  IEncrypter,
  AccountModel,
  AddAccountModel,
  IAddAccount,
  IAddAccountRepository,
} from "./index";

class DbAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter;
  private readonly addAccountRepository: IAddAccountRepository;
  constructor(
    encrypter: IEncrypter,
    addAccountRepository: IAddAccountRepository
  ) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);
    const newAccount = Object.assign(accountData, {
      password: hashedPassword,
      id: "valid_id",
    });
    await this.addAccountRepository.add(newAccount);
    return newAccount;
  }
}

export { DbAddAccount };
