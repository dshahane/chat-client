import gql from 'graphql-tag';

export const directMessagesQuery = gql`
query ($teamId: Int!, $otherUserId: Int!) {
  directMessages(teamId: $teamId, otherUserId: $otherUserId) {
    id
    text
    user {
      id
      username
    }
    timestamp
  }
}
`;

export const allMessagesQuery = gql`
query($channelId: Int!) {
  allMessages(channelId: $channelId) {
    id
    text
    user {
      id
      username
    }
    timestamp
  }
}
`;

export const createChannelMessageSubscription = gql`
subscription($channelId: Int!) {
  createChannelMessage(channelId: $channelId) {
    id
    text
    user {
      id
      username
    }
    timestamp
  }
}
`;
// newDirectMessage must match subscription name
export const createDirectMessageSubscription = gql`
subscription($teamId: Int!, $userId: Int!) {
  createDirectMessage(teamId: $teamId, userId: $userId) {
    id
    text
    user {
      id
      username
    }
    timestamp
  }
}
`;
