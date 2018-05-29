import React, { Component } from 'react';
import compact from 'lodash/compact';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import { Message, Form, Container, Header, Input, Button } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Login extends Component {
  constructor() {
    super();
    extendObservable(this, {
      email: '',
      password: '',
      errors: [],
    });
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  }

  onSubmit = async () => {
    const { email, password } = this;
    const response = await this.props.mutate({ variables: { email, password } });
    const {
      ok, token, refreshToken, errors,
    } = response.data.login;

    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      this.props.history.push('/');
    } else {
      const errList = {};
      errors.forEach(({ path, message }) => {
        errList[`${path}Error`] = message;
      });
      this.errors = errList;
    }
  }

  render() {
    const { email, password, errors: { emailError, passwordError } } = this;

    return (
      <Container text>
        <Header as="h2">Login</Header>
        <Form>
          <Form.Field error={!!emailError}>
            <Input
              name="email"
              onChange={this.onChange}
              value={email}
              placeholder="Email"
              fluid
            />
          </Form.Field>
          <Form.Field error={!!passwordError}>
            <Input
              name="password"
              onChange={this.onChange}
              value={password}
              placeholder="password"
              type="password"
              fluid
            />
          </Form.Field>
          <Button
            name="sumbit"
            onClick={this.onSubmit}
            primary
          >
          Submit
          </Button>
        </Form>
        <br />
        {(passwordError || emailError) ? <Message
          error
          header="Login Errors"
          list={compact([
                passwordError,
                emailError,
            ])}
        /> : null}
      </Container>
    );
  }
}

const LoginMutation = gql`
mutation($email:String!, $password:String!) {
  login(email: $email, password: $password) {
    ok
    errors {
      path
      message
    }
    token
    refreshToken
  }
}
`;

export default graphql(LoginMutation)(observer(Login));
