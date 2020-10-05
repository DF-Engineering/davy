import {
    AUTHORIZE_ACCOUNT,
    OAUTH_CALLBACK
  } from "../actions/types";

  const initialState = {
    accounts: [],
    accountsLoading: false,
  };
  export default function(state = initialState, action) {
    switch (action.type) {
      case AUTHORIZE_ACCOUNT:
        return {
          ...state,
          accounts: [action.payload, ...state.accounts],
          accountsLoading: false
        };
      case OAUTH_CALLBACK:
        return {
          ...state,
          accounts: action.payload,
          accountsLoading: false
        };

      default:
        return state;
    }
}