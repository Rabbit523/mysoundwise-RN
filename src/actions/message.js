import { createAction } from 'redux-actions'

// Action Types

export const REQUEST_MESSAGES = 'soundwise/message/REQUEST_MESSAGES'

export const RECEIVE_MESSAGES = 'soundwise/message/RECEIVE_MESSAGES'

export const REFRESH_MESSAGES = 'soundwise/message/REFRESH_MESSAGES'

export const SELECT_MESSAGE = 'soundwise/message/SELECT_MESSAGE'

export const SELECT_SUBSCRIPTION = 'soundwise/message/SELECT_SUBSCRIPTION'

// Action Creators

export const requestMessages = createAction(REQUEST_MESSAGES)

export const receiveMessages = createAction(RECEIVE_MESSAGES)

export const refreshMessages = createAction(REFRESH_MESSAGES)

export const selectMessage = createAction(SELECT_MESSAGE)

export const selectSubscription = createAction(SELECT_SUBSCRIPTION)
