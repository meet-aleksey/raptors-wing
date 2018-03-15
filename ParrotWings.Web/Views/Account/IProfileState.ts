import { IUser, ISearchUserResult } from "@Models";

export interface IProfileState {

  user?: IUser;

  login?: boolean;

  processing?: boolean;

  transfer?: boolean;

  searching?: boolean;

  findUsers?: string;

  users?: Array<ISearchUserResult>;

  selectedUser?: IUser;

  amount?: number;

  validation?: {
    amount?: boolean,
    findUsers?: boolean
  }

  customValidation?: {
    findUsers: () => boolean,
    amount: () => boolean
  }

  notify?: string | string[];

}

export default IProfileState;