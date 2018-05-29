import React from 'react';
import { graphql } from 'react-apollo';
import Messages from '../components/messages';

import { directMessagesQuery, createDirectMessageSubscription } from '../graphql/messages';

class DirectMessagesContainer extends React.Component {
  componentDidMount() {
    this.unsubscribe = this.subscribe(this.props.teamId, this.props.otherUserId);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.teamId !== newProps.teamId || this.props.otherUserId !== newProps.otherUserId) {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = this.subscribe(newProps.teamId, newProps.otherUserId);
      }
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = (teamId, userId) => {
    console.log('subscribing', teamId, userId);
    return this.props.data.subscribeToMore({
      document: createDirectMessageSubscription,
      variables: { teamId, userId },
      updateQuery: (prev, { subscriptionData }) => {
        console.log(subscriptionData);
        if (!subscriptionData) return prev;
        console.log(subscriptionData);
        const retval = {
          ...prev,
          directMessages: [...prev.directMessages, subscriptionData.data.createDirectMessage],
        };
        console.log(retval);
        return retval;
      },
    });
  }

  render() {
    console.log('rendering ', this.props);
    const { data: { loading, directMessages } /* team */ } = this.props;
    console.log(directMessages);
    return ((loading) ? null : (<Messages messages={directMessages} />));
  }
}

export default graphql(directMessagesQuery, {
  variables: props => ({
    teamId: props.teamId,
    otherUserId: props.otherUserId,
  }),
  // Always fetch to avoid caching effect when changing to subscribed channels
  options: props => ({
    fetchPolicy: 'network-only',
    variables: {
      teamId: props.teamId,
      otherUserId: props.otherUserId,
    },
  }),
})(DirectMessagesContainer);
