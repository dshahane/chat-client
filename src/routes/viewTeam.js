import React from 'react';
import { Redirect } from 'react-router-dom';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import findIndex from 'lodash/findIndex';
import AppLayout from '../components/app-layout';
import Sidebar from '../containers/sidebar';
import Header from '../components/header';
import MessagesContainer from '../containers/messagesContainer';
import SendMessage from '../components/sendMessage';
import { meQuery } from '../graphql/teams';

//  'background-color': '#6f4f5f',
const messageListStyle = {
  backgroundColor: '#61A4D8',
  display: 'flex',
  flexDirection: 'column-reverse',
  overflowY: 'auto',
};

const ViewTeam = ({
  mutate,
  data: { loading, me },
  match: { params: { teamId, channelId } },
}) => {
  if (loading) {
    return null;
  }
  // console.log(me);
  const { teams, username } = me;
  if (!teams.length) {
    return <Redirect to="/create-team" />;
  }
  // If no team was selected use the first one
  const teamIdInt = parseInt(teamId, 10);
  const currTeamIdx = teamIdInt ? findIndex(teams, ['id', teamIdInt]) : 0;
  const team = currTeamIdx === -1 ? teams[0] : teams[currTeamIdx];
  // console.log(team);
  const channelIdInt = parseInt(channelId, 10);
  const currChannelIdx = channelIdInt ? findIndex(team.channels, ['id', channelIdInt]) : 0;
  const channel = currChannelIdx === -1 ? team.channels[0] : team.channels[currChannelIdx];
  // console.log(mutate);
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
      <div style={messageListStyle}>
        {channel && <SendMessage
          placeholder={channel.name}
          onSubmit={text =>
            mutate({ variables: { channelId: channel.id, message: text } })
          }
        />}
        {channel && <MessagesContainer channel={channel} team={team} channelId={channel.id} />}
        {channel && <Header channelName={channel.name} />}
      </div>
    </AppLayout>
  );
};

const createMessageMutation = gql`
  mutation($channelId: Int!, $message: String!) {
    createMessage(channelId:$channelId, text:$message) 
  }
`;

export default compose(
  graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(createMessageMutation),
)(ViewTeam);
