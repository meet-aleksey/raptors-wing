import * as React from 'react';
import { Component } from '@Core';
import {
  CircularProgress,
  Table, TableBody, TableHeader,
  TableHeaderColumn, TableRow, TableRowColumn
} from 'material-ui';
import { green900, redA700 } from 'material-ui/styles/colors';
import { getTransactions, parseError } from '@Actions/ApiActions';
import ITransactionsState from './ITransactionsState';

export class Transactions extends Component<any, ITransactionsState> {

  constructor(props, context) {
    super(props, context);

    this.state = {
      page: 1,
      limit: 10,
      loading: false,
      list: null,
      message: null
    };
  }

  componentWillMount() {
    this.load();
  }

  load() {
    this.setStateAsync({
      loading: true
    }).then(() => {
      return getTransactions(this.state.page, this.state.limit);
    }).then((result) => {
      this.setState({
        list: result.data,
        loading: false
      });
    }).catch((error) => {
      this.setState({
        loading: false,
        message: parseError(error)
      });
    });
  }

  makeTable() {
    if (this.state.loading) {
      return null;
    }

    if (!this.state.list || this.state.list.totalRecords <= 0) {
      return (<div>No transactions.</div>);
    }

    let rows = new Array<JSX.Element>();
    const { data, users } = this.state.list;

    console.debug('users', users);

    data.forEach((transaction) => {
      const user = users.find(u => u.id == transaction.sourceId) || { userName: 'unknown', email: 'unknown@unknown' };

      console.debug('transaction', transaction, user);

      rows.push(
        <TableRow key={transaction.id}>
          <TableRowColumn>{transaction.id}</TableRowColumn>
          <TableRowColumn>{user.userName} &lt;{user.email}&gt;</TableRowColumn>
          <TableRowColumn style={{ color: transaction.amount > 0 ? green900 : redA700 }}>{transaction.amount}</TableRowColumn>
        </TableRow>
      );
    });

    return (
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>ID</TableHeaderColumn>
            <TableHeaderColumn>User</TableHeaderColumn>
            <TableHeaderColumn>Amount</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {rows}
        </TableBody>
      </Table>
    );
  }

  makeLoading() {
    if (!this.state.loading) {
      return null;
    }

    return (
      <div><CircularProgress size={18} /> Loading...</div>
    );
  }

  render() {
    return (
      <div>
        {this.makeTable()}
        {this.makeLoading()}
      </div>
    );
  }

}