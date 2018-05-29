import React from 'react';
import { findIndex } from 'lodash';
import { Modal, Button, Form } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { meQuery } from '../graphql/teams';

/* eslint-disable react/prefer-stateless-function */
const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => {
  /* props from Sidebar and from withFormik */
  const inlineStyle = {
    modal: {
      marginTop: '0px !important',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '350px',
    },
  };

  return (
    <Modal open={open} onClose={(e => onClose(e))} style={inlineStyle.modal}>
      <Modal.Header content="Add a Channel" />
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              name="channelName"
              value={values.channelName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter channel name"
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Button fluid disabled={isSubmitting} onClick={onClose}>Cancel</Button>
            <Button fluid disabled={isSubmitting} onClick={handleSubmit}>Add Channel</Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

const addChannelMutation = gql`
mutation($teamId: Int!, $channelName:String!) {
    createChannel(teamId: $teamId, name: $channelName) {
        ok
        channel {
            id
            name
        }
        errors {
            message
            path
        }
    }
  }
`;

export default compose(
  graphql(addChannelMutation),
  withFormik({
  // Transform outer props into form values
    mapPropsToValues: () => ({ channelName: '' }),
    // Submission handler
    // Props have {teamId -- sidebar and mutate -- graphql}
    handleSubmit: async (values, { props: { teamId, mutate, onClose }, setSubmitting }) => {
      console.log(teamId);
      console.log(values);
      await mutate({
        variables: {
          teamId,
          channelName: values.channelName,
        },
        update: (store, { data: { createChannel } }) => {
          const { ok, channel } = createChannel;
          if (!ok) {
            return;
          }
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: meQuery });
          const teamIdx = findIndex(data.me.teams, ['id', teamId]);
          data.me.teams[teamIdx].channels.push(channel);
          // Write our data back to the cache.
          store.writeQuery({ query: meQuery, data });
        },
      });
      onClose();
      setSubmitting(false);
    },
  }),
)(AddChannelModal);
