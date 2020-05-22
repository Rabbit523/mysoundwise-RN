import { createAction } from 'redux-actions'

// Action Types

export const REQUEST_PUBLISHERS = 'soundwise/publisher/REQUEST_PUBLISHERS'

export const RECEIVE_PUBLISHERS = 'soundwise/publisher/RECEIVE_PUBLISHERS'

// Action Creators

export const requestPublishers = createAction(REQUEST_PUBLISHERS)

export const receivePublishers = createAction(RECEIVE_PUBLISHERS)
