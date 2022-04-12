import { AccountModel } from "../models/addAccount";

interface AddAccountModel {
  name: string;
  email: string;
  password: string;
}

interface IAddAccount {
  add(account: AddAccountModel): AccountModel;
}

export { IAddAccount, AddAccountModel };
