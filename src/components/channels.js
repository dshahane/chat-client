import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

// Back #4e3a4c; color: #958993
const ChannelWrapper = styled.div`
  grid-column: 2;
  grid-row: 1 / 4;
  background-color: #2E86C1; 
  color: #D5D8DC;
  padding-top: 15px;
`;

// color #958993
const TeamNameHeader = styled.h1`
  color: #D5D8DC;
  font-size: 20px;
  margin-bottom: 0;
`;

const UserNameHeader = styled.h3`
  color: #D5D8DC;
  font-size: 12px;
  border: 1px solid;
  background-color: #1B4F72;
  padding: 4px;
  margin-top: 0;
  margin-bottom: 0;
  margin-right: 10px;
`;

const ActionLink = styled.a`
  color: #D5D8DC; 
`;

const SideBarList = styled.ul`
  width: 100%;
  list-style: none;
  padding-left: 0px;
`;

const paddingLeft = 'padding-left: 10px';

// Background #3e313c
const SideBarListItem = styled.li`
  color: #D5D8DC;
  padding: 2px;
  ${paddingLeft};
  &:hover {
    background: #1B4F72;
  }
`;

const SideBarListHeader = styled.li`${paddingLeft};`;

const PushLeft = styled.div`${paddingLeft};`;

const Green = styled.span`color: #38978d;`;

const Bubble = ({ on = true }) => (on ? <Green>●</Green> : '○');

const channel = ({ id, name }, teamId) => (
  <Link to={`/view-team/${teamId}/${id}`} key={`channel-${id}`}>
    <SideBarListItem># {name}</SideBarListItem>
  </Link>
);

const user = (teamId, { id, username }) => (
  <Link to={`/view-team/user/${teamId}/${id}`} key={`direct-user-${id}`}>
    <SideBarListItem key={`user-${id}`}>
      <Bubble /> {username}
    </SideBarListItem>
  </Link>
);

export default ({
  team, username, users, onAddChannelClick, onAddMemberClick, ownsTeam, onAddDirectMessageClick,
}) => (
  <ChannelWrapper>
    <PushLeft>
      <TeamNameHeader>{team.name}</TeamNameHeader>
      <UserNameHeader>{username.toUpperCase()}</UserNameHeader>
    </PushLeft>
    <div>
      <SideBarList>
        <SideBarListHeader>
            CHANNELS {ownsTeam && <Icon onClick={onAddChannelClick} name="add circle" /> }
        </SideBarListHeader>
        {team.channels.map(c => channel(c, team.id))}
      </SideBarList>
    </div>
    <div>
      <SideBarList>
        <SideBarListHeader>
          DIRECT MESSAGES {<Icon onClick={onAddDirectMessageClick} name="add circle" /> }
        </SideBarListHeader>
        {users.map(u => user(team.id, u))}
      </SideBarList>
    </div>
    {ownsTeam &&
    <div>
      <ActionLink href="#addMember" onClick={onAddMemberClick} >
        <Icon name="add circle" /> Invite Members
      </ActionLink>
    </div>
    }
  </ChannelWrapper>
);
