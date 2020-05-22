import { handleActions, handleAction } from 'redux-actions'
import R from 'ramda'
import { combineReducers } from 'redux'
import { RECEIVE_LISTENERS, REQUEST_LISTENERS } from '../actions'

const byId = handleAction(
  RECEIVE_LISTENERS,
  R.useWith(R.mergeDeepRight, [R.identity, R.prop('payload')]),

  {},
)

const allId = handleAction(
  RECEIVE_LISTENERS,
  R.useWith(R.union, [R.identity, R.pipe(R.prop('payload'), R.keys)]),
  [],
)

const items = combineReducers({ byId, allId })

const isFetching = handleActions(
  {
    [REQUEST_LISTENERS]: R.T,
    [RECEIVE_LISTENERS]: R.F,
  },
  false,
)

export default combineReducers({ items, isFetching })
