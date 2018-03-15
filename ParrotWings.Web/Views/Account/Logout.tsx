import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { Component } from '@Core';
import { setToken } from '@Actions/StorageActions';

export class Logout extends Component<any, any> {

  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    this.logout();
  }

  componentWillUpdate() {
    this.logout();
  }

  logout() {
    setToken(null);
  }

  render() {
    return (<Redirect to='/' />);
  }

}