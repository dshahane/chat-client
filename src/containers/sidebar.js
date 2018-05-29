import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Teams from '../components/teams';
import Channels from '../components/channels';
import AddChannelModal from '../components/addChannelModel';
import AddMemberModal from '../components/addMemberModel';
import AddDirectMessage from '../components/addDirectMessageModel';

class Sidebar extends React.Component {
  state = {
    modalOpenAddChannel: false,
    modalOpenAddMember: false,
    modalOpenAddDirectMessage: false,
  }

  toggleOpenAddChannel = (e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ modalOpenAddChannel: !state.modalOpenAddChannel }));
  };
  toggleOpenAddMember = (e) => {
    // OnClose called ditrectly in mutation HoC without an event
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ modalOpenAddMember: !state.modalOpenAddMember }));
  };
  toggleOpenAddDirectMessage = (e) => {
    // OnClose called ditrectly in mutation HoC without an event
    if (e) {
      e.preventDefault();
    }
    this.setState(state => ({ modalOpenAddDirectMessage: !state.modalOpenAddDirectMessage }));
  };
  handleAddDirectMessage = ({ id, username }) => {
    console.log(id, username);
  }
  render() {
    const {
      username, teams, team, data: { activeUsers, loading },
    } = this.props;
    const { modalOpenAddChannel, modalOpenAddMember, modalOpenAddDirectMessage } = this.state;
    return [
      <Teams key="team-sidebar" teams={teams} team={team} />,
      <Channels
        username={username}
        team={team}
        ownsTeam={team.admin}
        key="channel-sidebar"
        users={loading ? [] : activeUsers}
        onAddChannelClick={this.toggleOpenAddChannel}
        onAddMemberClick={this.toggleOpenAddMember}
        onAddDirectMessageClick={this.toggleOpenAddDirectMessage}
      />,
      <AddChannelModal
        key="add-channel-modal"
        teamId={team.id}
        ownsTeam={team.admin}
        open={modalOpenAddChannel}
        onClose={this.toggleOpenAddChannel}
      />,
      <AddMemberModal
        key="add-member-modal"
        team={team}
        ownsTeam={team.admin}
        open={modalOpenAddMember}
        onClose={this.toggleOpenAddMember}
      />,
      <AddDirectMessage
        key="add-direct-message-modal"
        teamId={team.id}
        open={modalOpenAddDirectMessage}
        onClose={this.toggleOpenAddDirectMessage}
        handleSubmit={this.handleAddDirectMessage}
      />,
    ];
  }
}

const dmUsersQuery = gql`
query ($teamId: Int!) {
  activeUsers(teamId: $teamId) {
    id
    username
  }
}
`;

export default graphql(dmUsersQuery, {
  // Always fetch to avoid caching effect when changing to subscribed channels
  options: props => ({
    variables: {
      teamId: props.team.id,
    },
    fetchPolicy: 'network-only',
  }),
})(Sidebar);
