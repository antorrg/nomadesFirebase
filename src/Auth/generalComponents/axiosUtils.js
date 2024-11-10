
const setAuthHeader = () => {
  const token = localStorage.getItem('validToken');
 
  const config = {};

  if (token) {
    config.headers = {
      'x-access-token':`${token}`
    };
  }

  return config;
};

export default setAuthHeader;