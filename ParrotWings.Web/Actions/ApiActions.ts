import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { token } from './StorageActions';
import { IUser, ISearchUserResult, ITransaction, IDataResult } from '@Models';

/**
 * Executes a request to the API using GET method.
 * 
 * @param path The path to the API method.
 */
export function get<T>(path: string): AxiosPromise<T> {
  console.debug('get', path);

  return axios.get<T>(API_URL + path).then((result) => {
    return result;
  }).catch((error) => {
    return axiosErrorHandler(error);
  });
}

/**
 * Executes a request to the API using POST method.
 * 
 * @param path The path to the API method.
 * @param data The request data.
 * @param config The request configuration.
 */
export function post<T>(path: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T> {
  console.debug('post', path, data, config);

  return axios.post<T>(API_URL + path, data, config).then((result) => {
    return result;
  }).catch((error) => {
    return axiosErrorHandler(error);
  });
}

/**
 * Default error handler.
 * 
 * @param error
 */
function axiosErrorHandler(error) {
  if (error.response && error.response.data) {
    return Promise.reject(error.response.data);
  } else {
    throw Promise.reject(error);
  }
}

/**
 * Creates new user.
 * 
 * @param userName User name.
 * @param email Email address.
 * @param password Password.
 * @param confirmPassword Confirm password.
 */
export function registration(userName: string, email: string, password: string, confirmPassword: string): AxiosPromise {
  return post(
    'api/account/registration',
    {
      userName: userName,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    }
  );
}

/**
 * Sends a request for an access token using the login (email) and password.
 * 
 * @param email
 * @param password
 */
export function login(email: string, password: string): AxiosPromise {
  let params = new URLSearchParams();

  params.append('grant_type', 'password');
  params.append('username', email);
  params.append('password', password);

  return post('oauth2/token', params);
}

/**
 * Gets current user profile.
 */
export function me(): AxiosPromise<IUser> {
  const config = {
    headers: { 'Authorization': 'Bearer ' + token }
  };

  return post<IUser>('api/account/me', null, config);
}

/**
 * Search users by name or email.
 * 
 * @param query Search string.
 */
export function searchUser(query: string): AxiosPromise<ISearchUserResult[]> {
  const config = {
    headers: { 'Authorization': 'Bearer ' + token }
  };
  
  return post<ISearchUserResult[]>('api/account/search', { query: query}, config);
}

/**
 * Performs transfer of funds from current user to another.
 * 
 * @param recipientId Recipient of funds.
 * @param amount Transfer amount.
 */
export function transfer(recipientId: number, amount: number): AxiosPromise {
  const config = {
    headers: { 'Authorization': 'Bearer ' + token }
  };

  return post('api/transactions/transaction', { sourceId: recipientId, amount: amount }, config);
}

export function getTransactions(page: number, limit?: number): AxiosPromise<IDataResult<ITransaction>> {
  const config = {
    headers: { 'Authorization': 'Bearer ' + token }
  };

  limit = limit || 10;

  return post<IDataResult<ITransaction>>('api/transactions/list', { page: page, limit: limit }, config);
}

/**
 * Extracts error message.
 * 
 * @param data
 */
export function parseError(data): string | string[] {
  console.debug('parseError', data);

  if (!data) {
    return 'Unknown error.';
  }

  if (data.error_description) {
    return data.error_description;
  }

  if (data.Message) {
    let result = [data.Message];
    
    if (data.ModelState) {
      const modelState = (Array.isArray(data.ModelState) ? data.ModelState : Object.keys(data.ModelState).map(key => data.ModelState[key]));

      modelState.forEach((item) => {
        let message = '';

        if (Array.isArray(item)) {
          message = item.join(' ').trim();
        } else {
          message = item;
        }

        if (message.length > 0) {
          result.push(message);
        }
      });
    }

    if (data.ExceptionMessage) {
      result.push(data.ExceptionMessage);
    }

    return (result.length == 1 ? result[0] : result);
  }

  if (data.Exception && data.Exception.Message) {
    return data.Exception.Message;
  }

  if (data.error) {
    return data.error;
  }

  return data;
}