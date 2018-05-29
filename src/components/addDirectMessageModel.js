import React from 'react';
import { Modal, Button, Grid, Input } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Downshift from 'downshift';
import gql from 'graphql-tag';

const inlineStyle = {
  modal: {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '350px',
  },
  typeahead: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  },
  action: {
    marginTop: '10px',
    width: '50%',
  },
};


class DirectMessageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {},
    };
  }

  render() {
    const {
      open, onClose, handleSubmit, isSubmitting, data: { getUsers },
    } = this.props;
    console.log(getUsers);
    return (
      <Modal open={open} onClose={onClose} style={inlineStyle.modal}>
        <Modal.Header content="Send Direct Message" />
        <Modal.Content>
          <Modal.Description className="inlineStyle.typeahead">
            <Downshift
              fluid
              onChange={(selection) => {
                console.log(selection);
                this.setState({ selected: { id: selection.id, username: selection.username } });
              }}
              itemToString={item => (item ? item.username : '')}
            >
              {({
              getInputProps,
              getItemProps,
              isOpen,
              inputValue,
              highlightedIndex,
              selectedItem,
            }) => (
              <div>
                {/*
                <Label {...getLabelProps()}>Name</Label> */}
                <Input
                  {...getInputProps()}
                  style={inlineStyle.typeahead}
                  value={this.state.selected.username}
                />
                {isOpen ? (
                  <div>
                    {getUsers
                      .filter(item => !inputValue || item.username.includes(inputValue))
                      .map((item, index) => (
                        <div
                          {...getItemProps({
                            key: item.id,
                            index,
                            item,
                            style: {
                              backgroundColor:
                                highlightedIndex === index ? 'lightgray' : 'white',
                              fontWeight: selectedItem === item.username ? 'bold' : 'normal',
                            },
                          })}
                        >
                          {item.username}
                        </div>
                      ))}
                  </div>
                ) : null}
              </div>
            )}
            </Downshift>
          </Modal.Description>
          <Grid columns="equal">
            <Grid.Row fluid>
              <Grid.Column style={inlineStyle.action} >
                <Button disabled={isSubmitting} onClick={onClose}>Cancel</Button>
              </Grid.Column>
              <Grid.Column style={inlineStyle.action} >
                <Button
                  disabled={isSubmitting}
                  onClick={handleSubmit(this.state.selected)}
                >
                  Add Member
                </Button>
              </Grid.Column>
            </Grid.Row>`
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

const getUsers = gql`
query ($teamId: Int!) {
  getUsers(teamId: $teamId) {
    id
    username
  }
}
`;

export default graphql(getUsers, {
  variables: props => ({
    teamId: props.teamId,
  }),
  // Always fetch to avoid caching effect when changing to subscribed channels
  options: () => ({
    fetchPolicy: 'network-only',
  }),
})(DirectMessageModal);
