/*!
 * Actions for forms.
 * Copyright © 2018, Aleksey <https://github.com/meet-aleksey>. 
 * Licensed under the MIT License (MIT)
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import comment from 'material-ui/svg-icons/communication/comment';

/**
 * Creates and sets default validation state for all fields of the component state.
 * 
 * @param component Current react-component instance.
 * @param ignore List of ignored items.
 */
export function makeDefaultValidationState(component: React.Component, ignore?: string[]): void {
  let validation = [];

  ignore = ignore || [];

  for (const key in component.state) {
    if (key === 'validation' || ignore.indexOf(key) != -1) {
      continue;
    }

    validation[key] = null;

    // TODO: if (typeof component.state[key] === 'object') {
    // }
  }

  component.state['validation'] = validation;
}

/**
 * Gets validation state for specified key.
 * 
 * For proper operation, the `validation` property must be present in the component state.
 * 
 * @param component Current react-component instance.
 * @param key Field key.
 */
export function getValidationState(component: React.Component, key: string | string[]): boolean {
  if (typeof key === 'string') {
    if (key.indexOf('.') == -1) {
      return component.state['validation'] ? component.state['validation'][key] : true;
    } else {
      key = key.split('.');
    }
  }

  let result = component.state['validation'];

  key.forEach((value) => {
    if (result) {
      result = result[value];
    }
  });

  return result as boolean;
}

/**
 * Chacks state and gets validation message for specified key.
 * 
 * For proper operation, the `validation` property must be present in the component state.
 * 
 * @param component Current react-component instance.
 * @param key Field key.
 * @param message Error message.
 */
export function getValidationMessage(component: React.Component, key: string | string[], message: string): string {
  if (getValidationState(component, key) === false) {
    return message;
  } else {
    return null;
  }
}

/**
 * Validates data in the form elements.
 * 
 * @param component Current react-component instance.
 */
export function isValid(component: React.Component): boolean {
  let result = true;

  $('input', ReactDOM.findDOMNode(component)).each((i, input: HTMLInputElement) => {
    if (!isValidInput(component, input)) {
      result = false;
    }
  });

  return result;
}

/**
 * Extracts keys list of element.
 * 
 * @param input The element for which the keys will be extracted.
 */
function getElementKeys(input: HTMLInputElement): string[] {
  let key: string = input.getAttribute('data-key') || input.getAttribute('id');
  let keys: string[];

  if (!key) {
    return null;
  }

  if (key.indexOf('.') == -1) {
    keys = [key];
  } else {
    keys = key.split('.');
  }

  return keys;
}

/**
 * Input field validation.
 * 
 * For proper operation, the `validation` property must be present in the component state.
 * 
 * @param component Current react-component instance.
 * @param input Instance of the input to validate.
 */
export function isValidInput(component: React.Component, input: HTMLInputElement): boolean {
  let result = true;
  let currentValidation = component.state['validation'];
  let validation = currentValidation;
  let keys: string[] = getElementKeys(input);
  let key: string;

  if (!keys) {
    return;
  }

  key = keys.pop();

  keys.forEach((value) => {
    validation = validation[value];
  });

  if (validation) {
    validation[key] = input.checkValidity();

    if (validation[key] && component.state['customValidation'] && typeof component.state['customValidation'][key] === 'function') {
      validation[key] = component.state['customValidation'][key]();
    }

    component.setState({ ['validation']: currentValidation } as any);

    result = validation[key];
  }

  console.debug('isValidInput', key, result);

  return result;
}

/**
 * Default text change handler.
 * 
 * @param component Current react-component instance.
 * @param event Evenet instance.
 * 
 * @example onChange={FormHelper.input_changed.bind(this, this)}
 */
export function inputChangeHandler(component: React.Component, event: Event): void {
  let input = (event.target as HTMLInputElement);
  let key: string = input.getAttribute('data-key') || input.getAttribute('id');
  let keys: string[];

  if (!key) {
    return;
  }

  let currentState = component.state;
  let data = currentState;

  if (key.indexOf('.') == -1) {
    keys = [key];
  } else {
    keys = key.split('.');
  }

  key = keys.pop();

  keys.forEach((value) => {
    data = data[value];
  });

  if (typeof data[key] === 'number') {
    data[key] = parseFloat(input.value);
  } else {
    data[key] = input.value;
  }

  component.setState(currentState);
}

/**
 * Default lostFocus handler for text fields.
 * 
 * @param component Current react-component instance.
 * @param event Evenet instance.
 * 
 * @example onBlur={FormHelper.input_lostFocus.bind(this, this)}
 */
export function inputBlurHandler(component: React.Component, event: Event): void {
  isValidInput(component, event.target as HTMLInputElement);
}