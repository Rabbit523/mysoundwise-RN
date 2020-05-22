import R from 'ramda'
import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux'
import {
  ONLINE,
  OFFLINE,
  SIGNIN,
  SIGNOUT,
  REQUEST_IDENTIFICATION,
  RECEIVE_IDENTIFICATION,
  REQUEST_AUTHENTIFICATION,
  RECEIVE_AUTHENTIFICATION,
  REQUEST_SIGNUP,
  RECEIVE_SIGNUP,
  FACEBOOK_CONNECT,
  FACEBOOK_CONNECTED,
  RESET_IDENTIFICATION,
  RESET_AUTHENTIFICATION,
} from '../actions'
import { AUTH } from '../constants'

const isOnline = handleActions(
  {
    [ONLINE]: R.T,
    [OFFLINE]: R.F,
  },
  false,
)

const isSignedIn = handleActions(
  {
    [SIGNIN]: R.T,
    [SIGNOUT]: R.F,
  },
  false,
)

const isIdentificated = handleActions(
  {
    [RECEIVE_IDENTIFICATION]: (_, { payload }) => payload,
    [SIGNOUT]: R.always(AUTH.PROCESS.NO_REQUEST),
    [RESET_IDENTIFICATION]: R.always(AUTH.PROCESS.NO_REQUEST),
  },
  AUTH.PROCESS.NO_REQUEST,
)

const isAuthentificated = handleActions(
  {
    [RECEIVE_AUTHENTIFICATION]: (_, { payload }) => payload,
    [SIGNOUT]: R.always(AUTH.PROCESS.NO_REQUEST),
    [RESET_AUTHENTIFICATION]: R.always(AUTH.PROCESS.NO_REQUEST),
  },
  AUTH.PROCESS.NO_REQUEST,
)

const isFetchingEmailForm = handleActions(
  {
    [REQUEST_IDENTIFICATION]: R.T,
    [RECEIVE_IDENTIFICATION]: R.F,
    [REQUEST_AUTHENTIFICATION]: R.T,
    [RECEIVE_AUTHENTIFICATION]: R.F,
    [REQUEST_SIGNUP]: R.T,
    [RECEIVE_SIGNUP]: R.F,
  },
  false,
)

const isFetchingFacebookConnection = handleActions(
  {
    [FACEBOOK_CONNECT]: R.T,
    [FACEBOOK_CONNECTED]: R.F,
  },
  false,
)

export default combineReducers({
  isOnline,
  isSignedIn,
  isIdentificated,
  isAuthentificated,
  isFetchingEmailForm,
  isFetchingFacebookConnection,
})
