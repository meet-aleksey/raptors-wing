import * as React from 'react';
import { Link } from 'react-router-dom';
import { RaisedButton as Button, CircularProgress } from 'material-ui';
import ISubmitButtonProps from './ISubmitButtonProps';

export class SubmitButton extends React.Component<ISubmitButtonProps, any> {

  constructor(props, context) {
    super(props, context);
  }

  render() {

    const { disabled, processing, lable, onClick } = this.props;
    const progress = processing ? (<CircularProgress size={32} style={{ float: 'left', marginLeft: '12px' }} />) : null;

    return (
      <div className="clearfix">
        <Button label={lable || 'Send'} disabled={disabled} primary onClick={onClick.bind(this)} className="pull-left" />
        {' '}
        {progress}
      </div>
    );
  }

}