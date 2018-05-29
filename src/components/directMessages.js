import React from 'react';
import { MessageList } from 'react-chat-elements';
import styled from 'styled-components';
import Identicon from 'identicon.js';
import moment from 'moment';

import './messages.css';
import { authenticatedUser } from '../utils/tokenUtils';

const DirectMessagesWrapper = styled.div`
  grid-column: 3;
  grid-row: 2;
  min-width: 140px;
  padding-left: 20px;
  padding-right: 20px;
`;

const DirectMessagesContainer = styled.div`
`;

const directMessageListStyle = {
  display: 'flex',
  flex: 1,
};

export default class DirectMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: this.data(props),
    };
    // console.log(this.state);
  }

  componentWillReceiveProps(newProps) {
    this.setState({ messages: this.data(newProps) });
  }

  // console.log(team);
  // String(Math.random()) + String(Math.random()
  photo = user => new Identicon(`${user.email}${user.nick}`, {
    margin: 0,
    size: 20,
  }).toString();

  // eslint-disable-next-line class-methods-use-this
  leftOrRight(author) {
    const { username } = authenticatedUser();
    if (!author) return 'left';
    return (username === author) ? 'left' : 'right';
  }

  data = (props) => {
    console.log(props.messages);
    const mappedMessages = props.messages.map(element => ({
      id: element.id,
      forwarded: true,
      position: this.leftOrRight(element.user.username),
      view: 'list',
      type: 'text',
      text: element.text,
      titleColor: 'blue',
      title: element.user.username,
      dateString: moment(new Date(element.timestamp)).format('HH:mm'),
      avatar: `data:image/png;base64,${this.photo(element.user)}`,
      status: 'read',
    }));
    return mappedMessages;
  };

  // eslint-disable-next-line class-methods-use-this
  forwardClick(e) {
    console.log('Forward Click', e);
  }

  render() {
    return (
      <DirectMessagesWrapper>
        <DirectMessagesContainer>
          <MessageList
            className="message-list"
            style={directMessageListStyle}
            lockable
            onForwardClick={this.forwardClick}
            downButtonBadge={10}
            dataSource={this.state.messages}
          />
        </DirectMessagesContainer>
      </DirectMessagesWrapper>
    );
  }
}
