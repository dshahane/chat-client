import React from 'react';
import { Input } from 'semantic-ui-react';
import styled from 'styled-components';
import { withFormik } from 'formik';
import './messages.css';

const SendMessageWrapper = styled.div`
    grid-column: 3;
    grid-row: 3;
    padding: 10px;
    background: #61A4D8;
`;

const ENTER_KEY = 13;

const SendMessage = ({
  placeholder,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <SendMessageWrapper>
    <Input
      onKeyDown={(e) => {
        if (e.keyCode === ENTER_KEY && !isSubmitting) {
          handleSubmit(e);
        }
      }}
      fluid
      name="message"
      value={values.message}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={`Message # ${placeholder}`}
    />
  </SendMessageWrapper>
);

export default withFormik({
  // Transform outer props into form values
  mapPropsToValues: () => ({ message: '' }),
  // Submission handler
  // Props have {teamId -- sidebar and mutate -- graphql}
  handleSubmit: async (values, { props: { onSubmit }, setSubmitting, resetForm }) => {
    if (!values.message || !values.message.trim()) {
      setSubmitting(false);
      return;
    }
    await onSubmit(values.message);
    resetForm();
  },
})(SendMessage);

