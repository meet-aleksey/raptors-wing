import * as React from 'react';
import { Redirect, Link } from 'react-router-dom';
import {
  TextField, Card, CardText,
  RaisedButton, FlatButton,
  Dialog, AutoComplete, CircularProgress 
} from 'material-ui';
import { green800, white } from 'material-ui/styles/colors';
import { Component } from '@Core';
import { Notification } from '@Views/Shared';
import { searchUser, transfer, parseError } from '@Actions/ApiActions';
import { setUserData } from '@Actions/StorageActions';
import IProfileState from './IProfileState';
import { Transactions } from './Transactions';

export class Profile extends Component<any, IProfileState> {

  static defaultProps = {
    pageTitle: 'User Profile'
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      user: {
        userName: '',
        parrotWings: 0
      },
      findUsers: '',
      users: [],
      selectedUser: {
        userName: '',
        email: '',
        id: 0
      },
      amount: 1,
      login: false,
      processing: false,
      transfer: false,
      searching: false,
      customValidation: {
        amount: () => this.state.amount > 0 && this.state.amount <= this.state.user.parrotWings,
        findUsers: () => this.state.selectedUser != null
      },
      notify: null
    };

    this.makeDefaultValidationState();
  }

  componentWillMount() {
    this.check();
  }

  check() {
    if (this.token == null) {
      this.setState({
        login: true
      });
    } else {
      this.setState({
        user: this.user
      });
    }
  }

  makeProfile() {
    let color = 'black';

    if (this.state.user.parrotWings > 0) {
      color = 'green';
    } else if (this.state.user.parrotWings < 0) {
      color = 'red';
    }

    return (
      <div>
        <h1>Hello, {this.state.user.userName}!</h1>
        <h2>Balance: <span style={{ color: color }}>PW {this.state.user.parrotWings}</span></h2>
        <RaisedButton
          backgroundColor={green800}
          labelColor={white}
          labelStyle={{ fontSize: 'xx-large', textTransform: 'none', padding: '6px' }}
          onClick={this.showTransferDialog.bind(this)}
          label="Transfer to user"
        />

        <br /><br />

        <Transactions />
      </div>
    );
  }

  makeTransferDialog() {
    if (this.state.user.parrotWings <= 0) {
      return (
        <Dialog
          actions={[<FlatButton label="Ok" primary={true} onClick={this.hideTransferDialog.bind(this)}/>]}
          modal={false}
          open={this.state.transfer}
          onRequestClose={this.hideTransferDialog.bind(this)}
        >
          Unfortunately you no longer have wings :-(<br /><br />
          Try to ask users of the system to share wings with you and then you can be happy again.
        </Dialog>
      );
    }

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.hideTransferDialog.bind(this)}
      />,
      <FlatButton
        label="Send"
        primary={true}
        keyboardFocused={true}
        onClick={this.send.bind(this)}
      />,
    ];

    return (
      <Dialog
        title="Transfer of Parrot Wings to the user"
        actions={actions}
        modal={true}
        open={this.state.transfer}
        onRequestClose={this.hideTransferDialog.bind(this)}
      >
        <AutoComplete
          required
          floatingLabelText="User name or email"
          filter={(searchText: string, key: string) => true}
          dataSource={this.state.users}
          dataSourceConfig={{ text: 'name', value: 'id' }}
          fullWidth={true}
          openOnFocus={true}
          value={this.state.findUsers}
          errorText={this.getValidationMessage('findUsers', 'Enter user name or email to search and select one')}
          onUpdateInput={this.searchUser.bind(this)}
          onNewRequest={(user) => this.setState({ selectedUser: user, findUsers: user.userName })}
        />
        <TextField
          required
          type="number"
          min={1}
          max={this.state.user.parrotWings}
          id="amount"
          autoComplete="any-number"
          disabled={this.state.processing}
          value={this.state.amount || 0}
          hintText="Amount"
          errorText={this.getValidationMessage('amount', `Enter an amount between 1 and ${this.state.user.parrotWings}`)}
          fullWidth={true}
          onChange={this.input_changed}
          onBlur={this.input_lostFocus}
        />
     </Dialog>
    );
  }

  showTransferDialog() {
    this.setState({ transfer: true });
  }

  hideTransferDialog() {
    this.setState({ transfer: false });
  }

  makeProcessingDialog() {
    if (!this.state.processing) {
      return null;
    }

    return (
      <Dialog
        modal={true}
        open={true}
        autoDetectWindowHeight={false}
        autoScrollBodyContent={false}
        contentStyle={{ width: 300 }}
      >
        <div style={{ textAlign: 'center' }}>
          Your wings take off...<br /><br />
          <CircularProgress size={80} />
          <br /><br />
          Please wait.
        </div>
      </Dialog>
    );
  }

  searchUser(query: string) {
    if (query.length < 2) {
      return;
    }

    this.setStateAsync({ searching: true }).then(() => {
      return searchUser(query);
    }).then((result) => {
      this.setState({
        users: result.data || [],
        searching: false
      });
    }).catch((error) => {
      /*this.setState({
        notify: parseError(error)
      });*/
      console.debug(error);
    });
  }

  send() {
    if (!this.isValid) {
      return;
    }

    this.setStateAsync({
      processing: true,
      transfer: false
    }).then(() => {
      return transfer(this.state.selectedUser.id, this.state.amount);
    }).then(() => {
      let user = this.state.user;

      user.parrotWings -= this.state.amount;

      setUserData(user);

      this.setState({
        processing: false,
        transfer: false,
        user: user
      });
    }).catch ((error) => {
      this.setState({
        notify: parseError(error),
        transfer: true,
        processing: false
      });
    });
  }

  render() {
    if (this.state.login) {
      return (<Redirect to='/login' />);
    }

    return (
      <div>
        <Card>
          <CardText>
            {this.makeProfile()}
          </CardText>
        </Card>

        {this.makeTransferDialog()}
        {this.makeProcessingDialog()}

        <Notification
          show={this.state.notify != null}
          text={this.state.notify}
          onClose={() => this.setState({ notify: null })}
        />
      </div>
    );
  }

}