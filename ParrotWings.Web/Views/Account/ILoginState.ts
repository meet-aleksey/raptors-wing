export interface ILoginState {

  email?: string;

  password?: string;

  validation?: {
    email?: boolean,
    password?: boolean,
  }

  success?: boolean;

  processing?: boolean;

  notify?: string;

}

export default ILoginState;