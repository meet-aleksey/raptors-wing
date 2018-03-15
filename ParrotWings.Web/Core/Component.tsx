import * as React from 'react';
import { Snackbar } from 'material-ui';
import {
  inputChangeHandler,
  inputBlurHandler,
  makeDefaultValidationState,
  getValidationMessage,
  isValid
} from '@Actions/FormActions';

import { token, getUserData } from '@Actions/StorageActions';

/**
 * Base class for Parrot Wings components.
 */
export class Component<P, S> extends React.Component<P, S> {

  public input_changed;
  public input_lostFocus;

  private _shouldComponentUpdate: boolean = true;

  shouldComponentUpdate() {
    return this._shouldComponentUpdate;
  }

  /**
   * Gets user data if the user is authorized.
   */
  public get user(): any {
    return getUserData();
  }

  /**
   * Gets user token.
   */
  public get token(): any {
    return token;
  }

  constructor(props, context) {
    super(props, context);

    this.input_changed = inputChangeHandler.bind(this, this);
    this.input_lostFocus = inputBlurHandler.bind(this, this);
  }

  /**
   * Changes the state and returns Promise.
   *
   * @param state New state.
   * @param doNotUpdate Prevents the component from updating when the state changes.
   * @param callback Callback function.
   */
  public setStateAsync(state: S, doNotUpdate?: boolean): Promise<S> {
    this._shouldComponentUpdate = (typeof doNotUpdate != 'boolean' || doNotUpdate === false);

    return new Promise((resolve) => {
      this.setState(state, () => {
        resolve(this.state);

        this._shouldComponentUpdate = true;
      });
    });
  }

  /**
   * Creates and sets default validation state for all fields of the component state.
   * 
   * @param ignore List of ignored items.
   */
  public makeDefaultValidationState(ignore?: string[]): void {
    makeDefaultValidationState(this, ignore);
  }

  /**
   * Contains the result of form validation of the current component instance.
   */
  public get isValid(): boolean {
    return isValid(this);
  }

  /**
   * Chacks and gets validation state message for specified key.
   * 
   * For proper operation, the `validation` property must be present in the component state.
   * 
   * @param key Field key.
   * @param message Error message.
   */
  public getValidationMessage(key: string | string[], message: string): string {
    return getValidationMessage(this, key, message);
  }

  componentDidMount() {
    if (this.props['pageTitle']) {
      document.title = `${this.props['pageTitle']} - ${TITLE}`;
    } else {
      document.title = TITLE;
    }
  }

}