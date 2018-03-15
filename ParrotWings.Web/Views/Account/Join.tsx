import * as React from 'react';
import { TextField, Card, CardTitle, CardText, CardActions } from 'material-ui';
import { Redirect, Link } from 'react-router-dom';
import { Component } from '@Core';
import { registration, parseError } from '@Actions/ApiActions';
import { SubmitButton, Notification } from '@Views/Shared';
import IJoinState from './IJoinState';

export class Join extends Component<any, IJoinState> {

  static defaultProps = {
    pageTitle: 'Join'
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      customValidation: {
        confirmPassword: () => this.state.password == this.state.confirmPassword
      },
      processing: false,
      success: false,
      notify: null
    };

    this.makeDefaultValidationState();
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
      return registration(
        this.state.name,
        this.state.email,
        this.state.password,
        this.state.confirmPassword
      );
    }).then(() => {
      this.setState({
        success: true
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
      return (<Redirect to='/login' />);
    }

    const disabled = this.state.processing;

    return (
      <Card>
        <CardText>
          <h1>Join the Parrot Wings</h1>
          To get started with Parrot Wings, just fill out and send this form.<br />
          If you already have an account on our site, <Link to="/login">login</Link>.<br /><br />
          <TextField
            required
            maxlength="50"
            type="text"
            id="name"
            disabled={disabled}
            autoComplete="name"
            value={this.state.name}
            hintText="Enter your name"
            errorText={this.getValidationMessage('name', 'Name is required')}
            onChange={this.input_changed}
            onBlur={this.input_lostFocus}
          /><br />
          <TextField
            required
            maxlength="50"
            type="email"
            id="email"
            disabled={disabled}
            autoComplete="email"
            value={this.state.email}
            hintText="Enter your email"
            errorText={this.getValidationMessage('email', 'Valid email address is required')}
            onChange={this.input_changed}
            onBlur={this.input_lostFocus}
          /><br />
          <TextField
            required
            maxlength="50"
            type="password"
            id="password"
            disabled={disabled}
            autoComplete="new-password"
            minlength="6"
            value={this.state.password}
            hintText="Enter password"
            errorText={this.getValidationMessage('password', 'Password is required (at least six characters)')}
            onChange={this.input_changed}
            onBlur={this.input_lostFocus}
          /><br />
          <TextField
            required
            maxlength="50"
            type="password"
            id="confirmPassword"
            disabled={disabled}
            autoComplete="new-password"
            value={this.state.confirmPassword}
            hintText="Confirm password"
            errorText={this.getValidationMessage('confirmPassword', 'Incorrect password')}
            onChange={this.input_changed}
            onBlur={this.input_lostFocus}
          />

          <br /><br />

          <SubmitButton disabled={disabled} processing={this.state.processing} onClick={this.submit.bind(this)} />

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