import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  FlatButton as Button, IconButton,
  IconMenu, MenuItem,
  Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
} from 'material-ui';
import { Grid } from 'react-flexbox-grid';
import { ActionHome } from 'material-ui/svg-icons';
import { token, getToken } from '@Actions/StorageActions';

export class Header extends React.Component<any, any> {

  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    getToken();
  }

  render() {
    let buttons = null;

    if (token == null) {
      buttons = (
        <div>
          <Button href="/login" label="Login" />
          <Button href="/Join" label="Join" />
        </div>
      );
    } else {
      buttons = (
        <div>
          <Button href="/profile" label="Profile" />
          <Button href="/logout" label="Logout" />
        </div>
      );
    }

    return (
      <header>
        <Grid>
          <Toolbar className="shadow">
            <ToolbarGroup>
              <IconButton href="/"><ActionHome /></IconButton>
              <ToolbarTitle text="Parrot Wings™" />
            </ToolbarGroup>
            <ToolbarGroup>
              {buttons}
            </ToolbarGroup>
          </Toolbar>
        </Grid>
      </header>
    );
  }

}