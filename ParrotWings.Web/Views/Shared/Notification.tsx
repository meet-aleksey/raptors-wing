import * as React from 'react';
import { Link } from 'react-router-dom';
import { Snackbar } from 'material-ui';
import INotificationProps from './INotificationProps';

export class Notification extends React.Component<INotificationProps, any> {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { show, text, onClose } = this.props;

    return (
      <Snackbar
        open={show}
        message={text}
        autoHideDuration={4000}
        onRequestClose={onClose.bind(this)}
      />
    );
  }

}