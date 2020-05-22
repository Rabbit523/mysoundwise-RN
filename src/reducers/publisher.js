import { handleActions, handleAction } from 'redux-actions'
import R from 'ramda'
import { combineReducers } from 'redux'
import { REQUEST_PUBLISHERS, RECEIVE_PUBLISHERS } from '../actions'

const byId = handleAction(
  RECEIVE_PUBLISHERS,
  R.useWith(R.mergeDeepRight, [R.identity, R.prop('payload')]),
  {},
)

const allId = handleAction(
  RECEIVE_PUBLISHERS,
  R.useWith(R.union, [R.identity, R.pipe(R.prop('payload'), R.keys)]),
  [],
)

const items = combineReducers({ byId, allId })

const isFetching = handleActions(
  {
    [REQUEST_PUBLISHERS]: R.T,
    [RECEIVE_PUBLISHERS]: R.F,
  },
  false,
)

export default combineReducers({ isFetching, items })
