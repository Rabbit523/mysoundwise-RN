import { createAction } from 'redux-actions'

// Action Types

export const ONLINE = 'soundwise/auth/ONLINE'

export const OFFLINE = 'soundwise/auth/OFFLINE'

export const FACEBOOK_CONNECT = 'soundwise/auth/FACEBOOK_CONNECT'

export const FACEBOOK_CONNECTED = 'soundwise/auth/FACEBOOK_CONNECTED'

export const REQUEST_IDENTIFICATION = 'soundwise/auth/REQUEST_IDENTIFICATION'

export const RECEIVE_IDENTIFICATION = 'soundwise/auth/RECEIVE_IDENTIFICATION'

export const REQUEST_AUTHENTIFICATION =
  'soundwise/auth/REQUEST_AUTHENTIFICATION'

export const RECEIVE_AUTHENTIFICATION =
  'soundwise/auth/RECEIVE_AUTHENTIFICATION'

export const RESET_IDENTIFICATION = 'soundwise/auth/RESET_IDENTIFICATION'

export const RESET_AUTHENTIFICATION = 'soundwise/auth/RESET_AUTHENTIFICATION'

export const SIGNIN = 'soundwise/auth/SIGNIN'

export const REQUEST_SIGNUP = 'soundwise/auth/REQUEST_SIGNUP'

export const RECEIVE_SIGNUP = 'soundwise/auth/RECEIVE_SIGNUP'

export const CHECK_IF_AUTHORIZED = 'soundwise/auth/CHECK_IF_AUTHORIZED'

export const DISPATCH_AFTER_AUTH = 'soundwise/auth/DISPATCH_AFTER_AUTH'

export const SIGNOUT = 'soundwise/auth/SIGNOUT'

// Action Creators

export const online = createAction(ONLINE)

export const offline = createAction(OFFLINE)

export const facebookConnect = createAction(FACEBOOK_CONNECT)

export const facebookConnected = createAction(FACEBOOK_CONNECTED)

export const requestIdentification = createAction(REQUEST_IDENTIFICATION)

export const receiveIdentification = createAction(RECEIVE_IDENTIFICATION)

export const resetIdentification = createAction(RESET_IDENTIFICATION)

export const resetAuthentification = createAction(RESET_AUTHENTIFICATION)

export const requestSignup = createAction(REQUEST_SIGNUP)

export const receiveSignup = createAction(RECEIVE_SIGNUP)

export const requestAuthentification = createAction(REQUEST_AUTHENTIFICATION)

export const receiveAuthentification = createAction(RECEIVE_AUTHENTIFICATION)

export const signin = createAction(SIGNIN)

export const checkIfAuthorized = createAction(CHECK_IF_AUTHORIZED)

export const signout = createAction(SIGNOUT)

export const dispatchAfterAuth = createAction(DISPATCH_AFTER_AUTH)
