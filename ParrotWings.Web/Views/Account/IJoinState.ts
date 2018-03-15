export interface IJoinState {

  name?: string;

  email?: string;

  password?: string;

  confirmPassword?: string;

  validation?: {
    name?: boolean,
    email?: boolean,
    password?: boolean,
    confirmPassword?: boolean
  }

  customValidation?: {
    confirmPassword: () => boolean;
  }

  success?: boolean;

  processing?: boolean;

  notify?: string | string[];

}

export default IJoinState;