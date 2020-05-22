import { handleActions, combineActions } from 'redux-actions'
import R from 'ramda'
import { combineReducers } from 'redux'
import {
  LIKE_COMMENT,
  REMOVE_LIKES,
  REQUEST_LIKES,
  RECEIVE_LIKES,
  UPDATE_EPISODE,
  UNLIKE_COMMENT,
  UPDATE_COMMENT,
  RECEIVE_UNLIKE_EPISODE,
  RECEIVE_UNLIKE_MESSAGE,
} from '../actions'
import { isExists } from '../utils'

const byId = handleActions(
  {
    [RECEIVE_LIKES]: R.useWith(R.mergeDeepRight, [
      R.identity,
      R.prop('payload'),
    ]),
    [LIKE_COMMENT]: R.useWith(
      (state, likeObject) => R.assoc(likeObject.likeId, likeObject, state),
      [R.identity, R.prop('payload')],
    ),
    [UNLIKE_COMMENT]: R.useWith(R.flip(R.dissoc), [
      R.identity,
      R.path(['payload', 'likeId']),
    ]),
    [combineActions(UPDATE_EPISODE, UPDATE_COMMENT)]: R.useWith(
      (state, { likeId, like }) =>
        isExists(like)
          ? R.mergeDeepRight(state, { [likeId]: like })
          : R.dissoc(likeId, state),
      [R.identity, R.prop('payload')],
    ),
    [combineActions(RECEIVE_UNLIKE_EPISODE, RECEIVE_UNLIKE_MESSAGE)]: R.useWith(
      R.flip(R.dissoc),
      [
        R.identity,
        R.pipe(
          R.prop('payload'),
          R.keys,
          R.head,
        ),
      ],
    ),
    [REMOVE_LIKES]: R.useWith(R.flip(R.omit), [R.identity, R.prop('payload')]),
  },
  {},
)

const allId = handleActions(
  {
    [RECEIVE_LIKES]: R.useWith(R.union, [
      R.identity,
      R.pipe(
        R.prop('payload'),
        R.keys,
      ),
    ]),
    [LIKE_COMMENT]: R.useWith(R.union, [
      R.identity,
      R.pipe(
        R.path(['payload', 'likeId']),
        R.of,
      ),
    ]),
    [UNLIKE_COMMENT]: R.useWith(R.flip(R.without), [
      R.identity,
      R.pipe(
        R.path(['payload', 'likeId']),
        R.of,
      ),
    ]),
    [combineActions(RECEIVE_UNLIKE_EPISODE, RECEIVE_UNLIKE_MESSAGE)]: R.useWith(
      R.flip(R.without),
      [
        R.identity,
        R.pipe(
          R.path('payload'),
          R.keys,
        ),
      ],
    ),
    [combineActions(UPDATE_EPISODE, UPDATE_COMMENT)]: R.useWith(
      (state, { likeId, like }) =>
        isExists(like) ? R.append(likeId, state) : R.without([likeId], state),
      [R.identity, R.prop('payload')],
    ),
    [REMOVE_LIKES]: R.useWith(R.flip(R.without), [
      R.identity,
      R.prop('payload'),
    ]),
  },
  [],
)

const items = combineReducers({ byId, allId })

const isFetching = handleActions(
  {
    [REQUEST_LIKES]: R.T,
    [RECEIVE_LIKES]: R.F,
  },
  false,
)

export default combineReducers({ items, isFetching })
