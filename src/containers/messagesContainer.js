import React from 'react';
import { graphql } from 'react-apollo';
import Messages from '../components/messages';

import { allMessagesQuery, createChannelMessageSubscription } from '../graphql/messages';

class MessagesContainer extends React.Component {
  componentDidMount() {
    this.unsubscribe = this.subscribe(this.props.channelId);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.channelId !== newProps.channelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = this.subscribe(newProps.channelId);
      }
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = (channelId) => {
    this.props.data.subscribeToMore({
      document: createChannelMessageSubscription,
      variables: { channelId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) return prev;
        console.log(subscriptionData);
        const retval = {
          ...prev,
          allMessages: [...prev.allMessages, subscriptionData.data.createChannelMessage],
        };
        console.log(retval);
        return retval;
      },
    });
  }

  render() {
    console.log('rendering ', this.props);
    const { data: { loading, allMessages } /* team */ } = this.props;
    return ((loading) ? null : (<Messages messages={allMessages} />));
  }
}

export default graphql(allMessagesQuery, {
  variables: props => ({
    channelId: props.channelId,
  }),
  // Always fetch to avoid caching effect when changing to subscribed channels
  options: () => ({
    fetchPolicy: 'network-only',
  }),
})(MessagesContainer);
