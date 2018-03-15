import * as Cookies from 'es-cookie';

export var token = null;

/**
 * Sets access token to cookies.
 * 
 * @param value The access token.
 */
export function setToken(value: string) {
  if (value == null) {
    Cookies.remove('token');
  }
  else {
    Cookies.set('token', value, { expires: 7, path: '/' });
  }

  token = value;
}

/**
 * Gets token from cookies.
 */
export function getToken() {
  return token = Cookies.get('token');
}

/**
 * Sets user data to local storage.
 * 
 * @param data User profile to set.
 */
export function setUserData(data: any) {
  window.localStorage.setItem('user', JSON.stringify(data));
}

/**
 * Gets user data from local storage.
 */
export function getUserData() {
  return JSON.parse(window.localStorage.getItem('user'));
}
