declare global {
  interface Window {
    xAuthToken: any;
  }
}

export const getToken = () => {
  return window.xAuthToken
}

export const saveLogin = (xAuthToken?: string) => {
  window.xAuthToken = xAuthToken;
  if (xAuthToken) {
    window.localStorage.setItem('xAuthToken', xAuthToken)
  }else {
    window.localStorage.removeItem('xAuthToken')
  }
  console.log('save xAuthToken>', xAuthToken);
}

export const loadLogin = () => {
  window.xAuthToken = window.localStorage.getItem('xAuthToken');
  console.log('load xAuthToken>', window.xAuthToken);
  return window.xAuthToken
}
