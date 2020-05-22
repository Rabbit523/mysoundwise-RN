import { handleActions, combineActions } from 'redux-actions'
import R from 'ramda'
import { combineReducers } from 'redux'
import {
  EDIT_COMMENT,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  UPDATE_COMMENT,
  COMMENT_EPISODE,
  COMMENT_MESSAGE,
  UNCOMMENT_MESSAGE,
  UNCOMMENT_EPISODE,
  LOCAL_COMMENT_EPISODE,
  LOCAL_UNCOMMENT_EPISODE,
  RECEIVE_EPISODE_COMMENTS,
  RECEIVE_MESSAGE_COMMENTS,
  RECEIVE_REFRESH_MESSAGE_COMMENTS,
} from '../actions'

const byId = handleActions(
  {
    [combineActions(
      RECEIVE_EPISODE_COMMENTS,
      RECEIVE_MESSAGE_COMMENTS,
    )]: R.useWith(R.mergeDeepRight, [
      R.identity,
      R.path(['payload', 'comments']),
    ]),
    [UPDATE_COMMENT]: R.useWith(R.mergeDeepRight, [
      R.identity,
      R.path(['payload', 'comment']),
    ]),
    [EDIT_COMMENT]: R.useWith(
      (state, { commentId, content }) =>
        R.assocPath([commentId, 'content'], content, state),
      [R.identity, R.prop('payload')],
    ),
    [LIKE_COMMENT]: R.useWith(R.flip(R.evolve), [
      R.identity,
      R.pipe(
        R.path(['payload', 'commentId']),
        commentId => ({ [commentId]: { likesCount: R.inc } }),
      ),
    ]),
    [UNLIKE_COMMENT]: R.useWith(R.flip(R.evolve), [
      R.identity,
      R.pipe(
        R.path(['payload', 'commentId']),
        commentId => ({ [commentId]: { likesCount: R.dec } }),
      ),
    ]),
    [COMMENT_MESSAGE]: R.useWith(
      (state, { commentId, ...rest }) =>
        R.mergeDeepRight(state, { [commentId]: { commentId, ...rest } }),
      [R.identity, R.prop('payload')],
    ),
    [combineActions(COMMENT_EPISODE, LOCAL_COMMENT_EPISODE)]: R.useWith(
      R.mergeDeepRight,
      [R.identity, R.prop('payload')],
    ),
    [combineActions(
      UNCOMMENT_MESSAGE,
      UNCOMMENT_EPISODE,
      LOCAL_UNCOMMENT_EPISODE,
    )]: R.useWith(R.flip(R.dissoc), [
      R.identity,
      R.path(['payload', 'commentId']),
    ]),
    [RECEIVE_REFRESH_MESSAGE_COMMENTS]: R.useWith(
      (state, { commentsToDelete, commentsToMerge }) =>
        R.pipe(
          R.omit(commentsToDelete),
          R.mergeDeepLeft(commentsToMerge),
        )(state),
      [R.identity, R.prop('payload')],
    ),
  },
  {},
)

const allId = handleActions(
  {
    [COMMENT_MESSAGE]: R.useWith(R.union, [
      R.identity,
      R.pipe(
        R.path(['payload', 'commentId']),
        R.of,
      ),
    ]),
    [combineActions(COMMENT_EPISODE, LOCAL_COMMENT_EPISODE)]: R.useWith(
      R.union,
      [
        R.identity,
        R.pipe(
          R.prop('payload'),
          R.keys,
        ),
      ],
    ),
    [combineActions(
      RECEIVE_EPISODE_COMMENTS,
      RECEIVE_MESSAGE_COMMENTS,
    )]: R.useWith(R.union, [
      R.identity,
      R.pipe(
        R.path(['payload', 'comments']),
        R.keys,
      ),
    ]),
    [combineActions(
      UNCOMMENT_MESSAGE,
      UNCOMMENT_EPISODE,
      LOCAL_UNCOMMENT_EPISODE,
    )]: R.useWith(R.flip(R.without), [
      R.identity,
      R.pipe(
        R.path(['payload', 'commentId']),
        R.of,
      ),
    ]),
    [RECEIVE_REFRESH_MESSAGE_COMMENTS]: R.useWith(
      (state, { commentsToDelete, commentsToMerge }) =>
        R.pipe(
          R.without(commentsToDelete),
          R.union(R.keys(commentsToMerge)),
        )(state),
      [R.identity, R.prop('payload')],
    ),
  },
  [],
)

export default combineReducers({ byId, allId })
