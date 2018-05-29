import React from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';

/* eslint-disable react/prefer-stateless-function */
const AddMemberModal = ({
  open,
  team,
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
    <Modal open={open} onClose={onClose} style={inlineStyle.modal}>
      <Modal.Header content={`Add Member to ${team.name}`} />
      <Modal.Content>
        <Form>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter email"
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Button fluid disabled={isSubmitting} onClick={onClose}>Cancel</Button>
            <Button fluid disabled={isSubmitting} onClick={handleSubmit}>Add Member</Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

const addMemberToTeamMutation = gql`
mutation($email:String!, $teamId: Int!) {
  addMemberToTeam(email: $email, teamId: $teamId) {
    ok
    errors {
      path
      message
    }
  }
}
`;

export default compose(
  graphql(addMemberToTeamMutation),
  withFormik({
  // Transform outer props into form values
    mapPropsToValues: () => ({ email: '' }),
    // Submission handler
    // Props have {teamId -- sidebar and mutate -- graphql}
    handleSubmit: async (values, { props: { mutate, onClose, team }, setSubmitting }) => {
      await mutate({
        variables: {
          email: values.email,
          teamId: team.id,
        },
      });
      onClose();
      setSubmitting(false);
    },
  }),
)(AddMemberModal);
