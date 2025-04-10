const auth = {
  getToken: () => localStorage.getItem('token'),
  loggedIn: () => !!localStorage.getItem('token'),
  logout: () => localStorage.removeItem('token'),
  login: (token: string) => {
    localStorage.setItem('token', token);
    window.dispatchEvent(new Event('storage')); // Trigger storage event to update state
  },
};

export default auth;
