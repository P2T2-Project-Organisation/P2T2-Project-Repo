const auth = {
  getToken: () => localStorage.getItem('token'),
  loggedIn: () => !!localStorage.getItem('token'),
  logout: () => localStorage.removeItem('token'),
  login: (token: string) => localStorage.setItem('token', token), // Add login method
};

export default auth;
