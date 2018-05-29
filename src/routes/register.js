import React, { Component } from 'react';
import compact from 'lodash/compact';
import { Form, Container, Header, Input, Button, Message } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Register extends Component {
    state = {
      username: '',
      email: '',
      password: '',
      usernameError: '',
      emailError: '',
      passwordError: '',
      nick: '',
      url: '',
    };

    onChange = (e) => {
      const { name, value } = e.target;
      this.setState({ [name]: value });
    };

    onSubmit = async () => {
      this.setState({
        usernameError: '',
        emailError: '',
        passwordError: '',
      });

      const response = await this.props.mutate({
        variables: this.state,
      });
      const { ok, errors } = response.data.register;

      if (ok) {
        // Redirect
        this.props.history.push('/');
      } else {
        const sortedErrors = {};
        errors.forEach(({ path, message }) => {
          sortedErrors[`${path}Error`] = message;
        });
        this.setState(sortedErrors);
      }
    }
    render() {
      const {
        username, email, password, usernameError, emailError, passwordError, nick, url,
      } = this.state;

      return (
        <Container text>
          <Header as="h2">Register</Header>
          <Form>
            <Form.Field error={!!usernameError}>
              <Input
                name="username"
                onChange={this.onChange}
                value={username}
                placeholder="Username"
                fluid
              />
            </Form.Field>
            <Form.Field >
              <Input
                name="nick"
                onChange={this.onChange}
                icon="tags"
                iconPosition="left"
                label={{ tag: true, content: 'nick' }}
                labelPosition="right"
                value={nick}
                fluid
              />
            </Form.Field>
            <Form.Field >
              <Input
                name="Avatar"
                type="url"
                label="Avatar"
                placeholder="http://myavatar.com/me"
                onChange={this.onChange}
                value={url}
                fluid
              />
            </Form.Field>
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
          {(usernameError || passwordError || emailError) ? <Message
            error
            header="Registration Errors"
            list={compact([
                usernameError,
                passwordError,
                emailError,
            ])}
          /> : null}
        </Container>

      );
    }
}

const registerMutation = gql`
    mutation ($username:String!, $email:String!, $password:String!, $nick:String, $avatar:String){
        register(username:$username, email:$email, password:$password, nick:$nick, url:$avatar) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

export default graphql(registerMutation)(Register);
