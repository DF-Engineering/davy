import axios from "axios";
import {
  AUTHORIZE_ACCOUNT,
  OAUTH_CALLBACK
} from "./types";

import { auth } from "../firebase";
import setAuthToken from "../utils/setAuthToken";

// Actions will go here

// Add account
export const authorizeAccount = () => dispatch => {
  auth
  .currentUser
  .getIdToken()
  .then(function(result) {
    setAuthToken(result);
    axios
    .get("/api/oauth/authorize")
    .then(res =>
      dispatch({
        type: AUTHORIZE_ACCOUNT,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err))
};

// Get all accounts for specific user
export const authCallback = () => dispatch => {
  auth
  .currentUser
  .getIdToken()
  .then(function(result) {
    setAuthToken(result);
    axios.post("/api/oauth/callback")
      .then(res =>
        dispatch({
          type: OAUTH_CALLBACK,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: OAUTH_CALLBACK,
          payload: null
        })
      );  
  })
};
