import { IUser } from "@Models";

export interface ITransaction {

  id?: number;

  userId?: number;

  sourceId?: number;

  user?: IUser;

  source?: IUser;

  amount?: number;

  transactionDate?: string;

}