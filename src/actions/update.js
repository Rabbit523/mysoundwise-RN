import { createAction } from 'redux-actions'

// Action Types

export const REQUEST_UPDATES = 'soundwise/update/REQUEST_UPDATES'

export const RECEIVE_UPDATES = 'soundwise/update/RECEIVE_UPDATES'

export const REFRESH_UPDATES = 'soundwise/update/REFRESH_UPDATES'

export const REPLACE_UPDATES = 'soundwise/update/REPLACE_UPDATES'

export const PREPARE_FOR_TRANSITION = 'soundwise/update/PREPARE_FOR_TRANSITION'

export const FINISH_PREPARING = 'soundwise/update/FINISH_PREPARING'

// Action Creators

export const requestUpdates = createAction(REQUEST_UPDATES)

export const receiveUpdates = createAction(RECEIVE_UPDATES)

export const refreshUpdates = createAction(REFRESH_UPDATES)

export const replaceUpdates = createAction(REPLACE_UPDATES)

export const prepareForTransition = createAction(PREPARE_FOR_TRANSITION)

export const finishPreparing = createAction(FINISH_PREPARING)
