import { createAction } from 'redux-actions'

// Action Types

export const REQUEST_LISTENERS = 'soundwise/listener/REQUEST_LISTENERS'

export const RECEIVE_LISTENERS = 'soundwise/listener/RECEIVE_LISTENERS'

// Action Creators

export const requestListeners = createAction(REQUEST_LISTENERS)

export const receiveListeners = createAction(RECEIVE_LISTENERS)
