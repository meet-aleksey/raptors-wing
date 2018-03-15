import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Grid } from 'react-flexbox-grid';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Header, Footer } from '@Views/Shared';
import routes from './Routes';
import theme from './Theme';
import 'typeface-roboto';

ReactDOM.render((
  <Router>
    <MuiThemeProvider muiTheme={theme}>
      <Header />

      <Grid>
        {routes}
      </Grid>

      <Footer />
    </MuiThemeProvider>
  </Router>
), document.getElementById('app'));