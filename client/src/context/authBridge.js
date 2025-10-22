// src/context/authBridge.js
let _getAccessToken = () => null;
let _setAccessToken = () => {};
let _clear = () => {};

export const authBridge = {
  init({ getAccessToken, setAccessToken, clear }) {
    _getAccessToken = getAccessToken || _getAccessToken;
    _setAccessToken = setAccessToken || _setAccessToken;
    _clear = clear || _clear;
  },
  getAccessToken() {
    return _getAccessToken();
  },
  setAccessToken(t) {
    return _setAccessToken(t);
  },
  clear() {
    return _clear();
  },
};
