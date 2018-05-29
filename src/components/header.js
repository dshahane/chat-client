import React from 'react';
import styled from 'styled-components';
import { Header } from 'semantic-ui-react';
import './messages.css';

const HeaderWrapper = styled.div`
    grid-column: 3;
    grid-row: 1;
    color: #fff;
    background: '#61A4D8';
`;

export default ({ channelName }) => (
  <HeaderWrapper>
    <Header className="rce-header-footer" as="h1" align="center">{`# ${channelName}`}</Header>
  </HeaderWrapper>
);
