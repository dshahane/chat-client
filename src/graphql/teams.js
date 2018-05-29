import gql from 'graphql-tag';

export const meQuery = gql`
{
  me {
    id
    username
    email
    nick
    url
    teams {
      id
      name
      admin
      channels {
        id
        name
      }
    }
  }
}
`;

export const dummy = '';

