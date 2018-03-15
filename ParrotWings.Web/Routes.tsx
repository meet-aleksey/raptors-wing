import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Index as Home } from '@Views/Home';
import { Join, Login, Logout, Profile } from '@Views/Account';

const routes = (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/join" component={Join} />
    <Route path="/profile" component={Profile} />
    <Route path="/logout" component={Logout} />
  </Switch>
);

export default routes;