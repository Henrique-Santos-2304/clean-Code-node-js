import { AccountModel, AddAccountModel } from "../useCases/add-account";

interface IAddAccountRepository {
  add(account: AddAccountModel): Promise<AccountModel>;
}

export { IAddAccountRepository };
