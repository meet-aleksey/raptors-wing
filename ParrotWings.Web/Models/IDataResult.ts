import { IUser } from "@Models";

export interface IDataResult<T> {

  totalRecords?: number;

  data?: Array<T>;

  users?: Array<IUser>;

}