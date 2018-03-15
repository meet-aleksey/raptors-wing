import { IDataResult, ITransaction } from "@Models";

export interface ITransactionsState {

  loading?: boolean;

  page?: number;

  limit?: number;

  list?: IDataResult<ITransaction>;

  message?: string | string[];

}

export default ITransactionsState;