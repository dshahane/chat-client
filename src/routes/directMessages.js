import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import findIndex from 'lodash/findIndex';
import AppLayout from '../components/app-layout';
import Sidebar from '../containers/sidebar';
import Header from '../components/header';
import DirectMessagesContainer from '../containers/directMessagesContainer';
import SendMessage from '../components/sendMessage';
import { meQuery } from '../graphql/teams';

const messageListStyle = {
  display: 'flex',
  backgroundColor: '#61A4D8',
  flexDirection: 'column-reverse',
  overflowY: 'auto',
};

const DirectMessages = ({
  mutate,
  data: { loading, me },
  match: { params: { teamId, userId } },
}) => {
  if (loading) {
    return null;
  }

  const { teams, username } = me;

  // If no team was selected use the first one
  const teamIdInt = parseInt(teamId, 10);
  const currTeamIdx = teamIdInt ? findIndex(teams, ['id', teamIdInt]) : 0;
  const team = currTeamIdx === -1 ? teams[0] : teams[currTeamIdx];

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
        username={username}
      />
      <Header channelName={username} />
      <div style={messageListStyle}>
        <DirectMessagesContainer teamId={team.id} otherUserId={userId} />
      </div>
      <SendMessage
        onSubmit={text =>
            mutate({ variables: { receiverId: userId, text, teamId } })
          }
        placeholder={username}
      />
    </AppLayout>
  );
};

const createDirectMessageMutation = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId:$receiverId, text:$text, teamId: $teamId) 
  }
`;

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createDirectMessageMutation),
)(DirectMessages);
