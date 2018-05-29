import React, { Component } from 'react';
import compact from 'lodash/compact';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import { Message, Form, Container, Header, Input, Button } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CreateTeam extends Component {
  constructor() {
    super();
    extendObservable(this, {
      name: '',
      errors: [],
    });
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  }

  onSubmit = async () => {
    const { name } = this;

    let response;
    try {
      response = await this.props.mutate({
        variables: { name },
      });
    } catch (error) {
      this.props.history.push('/login');
      return;
    }

    const {
      ok, errors, team,
    } = response.data.createTeam;

    console.log(response.data.createTeam);

    if (ok) {
      this.props.history.push(`/view-team/${team.id}`);
    } else {
      const errList = {};
      errors.forEach(({ path, message }) => {
        errList[`${path}Error`] = message;
      });
      this.errors = errList;
    }
  }

  render() {
    const { name, errors: { nameError } } = this;

    return (
      <Container text>
        <Header as="h2">Create Team</Header>
        <Form>
          <Form.Field error={!!nameError}>
            <Input
              name="name"
              onChange={this.onChange}
              value={name}
              placeholder="Name"
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
        {(nameError) ? <Message
          error
          header="Create Team Errors"
          list={compact([
                nameError,
            ])}
        /> : null}
      </Container>
    );
  }
}

const CreateTeamMutation = gql`
mutation($name: String!) {
    createTeam(name:$name) {
      ok
      team {
        id
        channels {
          id
          name
        }
      }
      errors {
        message
        path
      }
    }
  }  
`;

export default graphql(CreateTeamMutation)(observer(CreateTeam));
