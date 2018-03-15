import * as React from 'react';
import { Toolbar, ToolbarGroup } from 'material-ui';
import { Grid } from 'react-flexbox-grid';

export class Footer extends React.Component<any, any> {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <footer>
        <Grid>
          <Toolbar className="footer-content shadow">
            <ToolbarGroup>
              Copyright © Parrot Wings™, 2018. All right reserved and not a single parrot was hurt.
            </ToolbarGroup>
          </Toolbar>
        </Grid>
      </footer>
    );
  }

}
