import { handleActions, handleAction, combineActions } from 'redux-actions'
import R from 'ramda'
import { combineReducers } from 'redux'
import {
  SELECT_MESSAGE,
  COMMENT_MESSAGE,
  REQUEST_MESSAGES,
  RECEIVE_MESSAGES,
  REFRESH_MESSAGES,
  UNCOMMENT_MESSAGE,
  SELECT_SUBSCRIPTION,
  REQUEST_LIKE_MESSAGE,
  RECEIVE_LIKE_MESSAGE,
  REQUEST_UNLIKE_MESSAGE,
  RECEIVE_UNLIKE_MESSAGE,
  RECEIVE_MESSAGE_COMMENTS,
  REQUEST_MESSAGE_COMMENTS,
  REQUEST_REFRESH_MESSAGE_COMMENTS,
  RECEIVE_REFRESH_MESSAGE_COMMENTS,
} from '../actions'

const byId = handleActions(
  {
    [REQUEST_LIKE_MESSAGE]: R.useWith(
      (state, { messageId }) =>
        R.evolve({ [messageId]: { likesCount: R.inc } }, state),
      [R.identity, R.prop('payload')],
    ),
    [RECEIVE_LIKE_MESSAGE]: R.useWith(
      (state, { messageId, userName }) =>
        R.evolve(
          {
            [messageId]: {
              lastLiked: R.always(userName),
            },
          },
          state,
        ),
      [R.identity, R.prop('payload')],
    ),
    [COMMENT_MESSAGE]: R.useWith(
      (state, messageId) =>
        R.evolve({ [messageId]: { commentsCount: R.inc } }, state),
      [R.identity, R.path(['payload', 'messageId'])],
    ),
    [combineActions(UNCOMMENT_MESSAGE)]: R.useWith(
      (state, { entityId: messageId }) =>
        R.evolve({ [messageId]: { commentsCount: R.dec } }, state),
      [R.identity, R.prop('payload')],
    ),
    [REQUEST_UNLIKE_MESSAGE]: R.useWith(
      (state, messageId) =>
        R.evolve({ [messageId]: { isLikeFetching: R.T } }, state),
      [R.identity, R.prop('payload')],
    ),
    [RECEIVE_UNLIKE_MESSAGE]: R.useWith(
      (state, { messageId, userName }) =>
        R.evolve(
          {
            [messageId]: {
              lastLiked: R.always(userName),
              likesCount: R.dec,
              isLikeFetching: R.F,
            },
          },
          state,
        ),
      [
        R.identity,
        R.pipe(
          R.prop('payload'),
          R.values,
          R.head,
        ),
      ],
    ),
    [RECEIVE_MESSAGES]: R.useWith(R.mergeDeepRight, [
      R.identity,
      R.prop('payload'),
    ]),
  },
  {},
)

const allId = handleAction(
  RECEIVE_MESSAGES,
  R.useWith(R.union, [
    R.identity,
    R.pipe(
      R.prop('payload'),
      R.keys,
    ),
  ]),
  [],
)

const items = combineReducers({ byId, allId })

const viewedMessage = handleAction(
  SELECT_MESSAGE,
  (_, { payload }) => payload,
  '',
)

const viewedSubscription = handleAction(
  SELECT_SUBSCRIPTION,
  (_, { payload }) => payload,
  '',
)

const isFetchingMessageComments = handleActions(
  {
    [REQUEST_MESSAGE_COMMENTS]: R.useWith(
      (state, messageId) => R.assoc(messageId, true, state),
      [R.identity, R.prop('payload')],
    ),
    [RECEIVE_MESSAGE_COMMENTS]: R.useWith(R.flip(R.dissoc), [
      R.identity,
      R.path(['payload', 'messageId']),
    ]),
  },
  {},
)

const isFetchingMessages = handleActions(
  {
    [REQUEST_MESSAGES]: R.T,
    [RECEIVE_MESSAGES]: R.F,
  },
  false,
)

const isRefreshingMessages = handleActions(
  {
    [REFRESH_MESSAGES]: R.T,
    [RECEIVE_MESSAGES]: R.F,
  },
  false,
)

const isRefreshingMessageComments = handleActions(
  {
    [REQUEST_REFRESH_MESSAGE_COMMENTS]: R.useWith(
      (state, messageId) => R.assoc(messageId, true, state),
      [R.identity, R.prop('payload')],
    ),
    [RECEIVE_REFRESH_MESSAGE_COMMENTS]: R.useWith(R.flip(R.dissoc), [
      R.identity,
      R.path(['payload', 'messageId']),
    ]),
  },
  {},
)

const fetching = combineReducers({
  isRefreshingMessageComments,
  isFetchingMessageComments,
  isRefreshingMessages,
  isFetchingMessages,
})

export default combineReducers({
  items,
  fetching,
  viewedMessage,
  viewedSubscription,
})
