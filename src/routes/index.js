import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { authenticatedUser } from '../utils/tokenUtils';

import Home from './home';
import Register from './register';
import Login from './login';
import CreateTeam from './createTeam';
import ViewTeam from './viewTeam';
import DirectMessages from './directMessages';

const PrivateRoute = ({ component: Component, ...rest }) =>
  (<Route
    {...rest}
    render={
      props => (
        authenticatedUser() ?
          <Component {...props} /> :
          <Redirect to={{ pathname: 'login' }} />
      )
    }
  />);

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/view-team/user/:teamId/:userId" component={DirectMessages} />
      <PrivateRoute path="/view-team/:teamId?/:channelId?" component={ViewTeam} />
      <PrivateRoute path="/create-team" component={CreateTeam} />
    </Switch>
  </BrowserRouter>
);
