import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  white, grey50,
  lightBlue800,
  red900
 } from 'material-ui/styles/colors';

const theme = getMuiTheme({
  toolbar: {
    backgroundColor: lightBlue800,
    color: white,
    iconColor: white,
    separatorColor: grey50,
  },
  palette: {
    primary1Color: lightBlue800,
    primary2Color: red900,
  }
});

export default theme;