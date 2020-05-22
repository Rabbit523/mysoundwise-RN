import R from 'ramda'

export const getAuthState = R.prop('auth')

export const getIsOnline = R.pipe(
  getAuthState,
  R.prop('isOnline'),
)

export const getIsSignedIn = R.pipe(
  getAuthState,
  R.prop('isSignedIn'),
)

export const getIsFetchingEmailForm = R.pipe(
  getAuthState,
  R.prop('isFetchingEmailForm'),
)

export const getIsFetchingFacebookConnection = R.pipe(
  getAuthState,
  R.prop('isFetchingFacebookConnection'),
)

export const getIsIdentificated = R.pipe(
  getAuthState,
  R.prop('isIdentificated'),
)

export const getIsAuthentificated = R.pipe(
  getAuthState,
  R.prop('isAuthentificated'),
)
