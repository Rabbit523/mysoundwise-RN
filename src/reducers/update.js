import { handleActions, combineActions } from 'redux-actions'
import R from 'ramda'
import { combineReducers } from 'redux'
import {
  SIGNOUT,
  REPLACE_UPDATES,
  REQUEST_UPDATES,
  RECEIVE_UPDATES,
  REFRESH_UPDATES,
  FINISH_PREPARING,
  PREPARE_FOR_TRANSITION,
} from '../actions'

const byId = handleActions(
  {
    [RECEIVE_UPDATES]: R.useWith(R.mergeDeepRight, [
      R.identity,
      R.prop('payload'),
    ]),
    [REPLACE_UPDATES]: (_, { payload }) => payload,
    [SIGNOUT]: R.always({}),
  },
  {},
)

const allId = handleActions(
  {
    [RECEIVE_UPDATES]: R.useWith(R.union, [
      R.identity,
      R.pipe(R.prop('payload'), R.keys),
    ]),
    [REPLACE_UPDATES]: (_, { payload }) => R.keys(payload),
    [SIGNOUT]: R.always({}),
  },
  {},
)

const page = handleActions(
  {
    [RECEIVE_UPDATES]: R.inc,
    [combineActions(REFRESH_UPDATES, SIGNOUT)]: R.always(0),
  },
  0,
)

const isPagesEnded = handleActions(
  {
    [RECEIVE_UPDATES]: (_, { payload }) => R.isEmpty(payload),
    [combineActions(REFRESH_UPDATES, SIGNOUT)]: R.always(false),
  },
  false,
)

const isRefreshing = handleActions(
  {
    [REFRESH_UPDATES]: R.T,
    [REPLACE_UPDATES]: R.F,
  },
  false,
)

const pagination = combineReducers({ page, isRefreshing, isPagesEnded })

const items = combineReducers({ byId, allId })

const isFetching = handleActions(
  {
    [REQUEST_UPDATES]: R.T,
    [RECEIVE_UPDATES]: R.F,
  },
  false,
)

const isPreparing = handleActions(
  {
    [PREPARE_FOR_TRANSITION]: R.T,
    [FINISH_PREPARING]: R.F,
  },
  false,
)

export default combineReducers({ items, isFetching, pagination, isPreparing })
