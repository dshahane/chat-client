import jwtdecode from 'jwt-decode';

export const authenticatedUser = () => {
  try {
    const { user } = jwtdecode(localStorage.getItem('token'));
    return user;
    // jwtdecode(localStorage.getItem('refreshToken'));
  } catch (err) {
    return undefined;
  }
};

export const dummy = 'dummy';
