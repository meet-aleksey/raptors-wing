import * as React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { TextField, Card, CardText } from 'material-ui';
import { Component } from '@Core';
import { login, me, parseError } from '@Actions/ApiActions';
import { setToken, setUserData } from '@Actions/StorageActions';
import { SubmitButton, Notification } from '@Views/Shared';
import ILoginState from './ILoginState';

export class Login extends Component<any, ILoginState> {

  static defaultProps = {
    pageTitle: 'Login'
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      email: '',
      password: '',
      processing: false,
      success: false,
      notify: null
    };

    this.makeDefaultValidationState(['processing', 'success', 'notify']);
  }

  componentWillMount() {
    if (this.token != null) {
      this.setState({
        success: true
      });
    }
  }

  componentWillUpdate() {
    if (this.token != null && !this.state.success) {
      this.setState({
        success: true
      });
    }
  }

  submit() {
    if (!this.isValid) {
      return;
    }

    this.setStateAsync({
      processing: true
    }).then(() => {
      return login(this.state.email, this.state.password);
    }).then((result) => {
      setToken(result.data['access_token']);

      return me();
    }).then((result) => {
      setUserData(result.data);

      this.setState({
        success: true,
        processing: false
      });
    }).catch((r) => {
      this.setState({
        notify: `${parseError(r)}`,
        processing: false
      });
    });
  }

  render() {
    if (this.state.success) {
      return (<Redirect to='/profile' />);
    }

    const disabled = this.state.processing;

    return (
      <Card>
        <CardText>
          <h1>Login</h1>
          <p>Enter your email and password that you used when registering.</p>
          <p>If you do not have an account yet, <Link to="/join">create one</Link>. It's free!</p>
          <TextField
            required
            maxlength="50"
            id="email"
            type="email"
            autoComplete="email"
            disabled={disabled}
            value={this.state.email}
            hintText="Email"
            errorText={this.getValidationMessage('email', 'Valid email address is required')}
            onChange={this.input_changed}
            onBlur={this.input_lostFocus}
          /><br />
          <TextField
            required
            maxlength="50"
            id="password"
            type="password"
            autoComplete="password"
            disabled={disabled}
            value={this.state.password}
            hintText="Password"
            errorText={this.getValidationMessage('password', 'Password is required')}
            onChange={this.input_changed}
            onBlur={this.input_lostFocus}
          />

          <br /><br />

          <SubmitButton lable="Login" disabled={disabled} processing={this.state.processing} onClick={this.submit.bind(this)} />

          <Notification
            show={this.state.notify != null}
            text={this.state.notify}
            onClose={() => this.setState({ notify: null })}
          />
        </CardText>
      </Card>
    );
  }

}