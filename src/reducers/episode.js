import { handleActions, handleAction, combineActions } from 'redux-actions'
import R from 'ramda'
import { combineReducers } from 'redux'
import {
  SIGNOUT,
  EPISODE_LOADED,
  UPDATE_DOWNLOAD_TASK,
  REMOVE_DOWNLOAD_TASK,
  UPDATE_EPISODE,
  SELECT_EPISODE,
  COMMENT_EPISODE,
  REMOVE_EPISODES,
  REQUEST_EPISODES,
  RECEIVE_EPISODES,
  UNCOMMENT_EPISODE,
  RECEIVE_LIKE_EPISODE,
  REQUEST_LIKE_EPISODE,
  REMOVE_LOCAL_EPISODE,
  LOCAL_COMMENT_EPISODE,
  RECEIVE_UNLIKE_EPISODE,
  REQUEST_UNLIKE_EPISODE,
  LOCAL_UNCOMMENT_EPISODE,
  REQUEST_EPISODE_COMMENTS,
  RECEIVE_RESTORE_EPISODES,
  RECEIVE_EPISODE_COMMENTS,
} from '../actions'

const byId = handleActions(
  {
    [RECEIVE_EPISODES]: R.useWith(R.mergeDeepRight, [
      R.identity,
      R.prop('payload'),
    ]),
    [combineActions(COMMENT_EPISODE, LOCAL_COMMENT_EPISODE)]: R.useWith(
      (state, { commentId, episodeId }) =>
        R.evolve({ [episodeId]: { comments: R.union([commentId]) } }, state),
      [
        R.identity,
        R.pipe(
          R.prop('payload'),
          R.values,
          R.head,
        ),
      ],
    ),
    [combineActions(UNCOMMENT_EPISODE, LOCAL_UNCOMMENT_EPISODE)]: R.useWith(
      (state, { commentId, entityId: episodeId }) =>
        R.evolve({ [episodeId]: { comments: R.without([commentId]) } }, state),
      [R.identity, R.prop('payload')],
    ),
    [REQUEST_LIKE_EPISODE]: R.useWith(
      (state, episodeId) =>
        R.evolve({ [episodeId]: { likesCount: R.inc } }, state),
      [R.identity, R.path(['payload', 'episodeId'])],
    ),
    [RECEIVE_LIKE_EPISODE]: R.useWith(
      (state, { episodeId, userName }) =>
        R.evolve(
          {
            [episodeId]: {
              lastLiked: R.always(userName),
            },
          },
          state,
        ),
      [R.identity, R.prop('payload')],
    ),
    [REQUEST_UNLIKE_EPISODE]: R.useWith(
      (state, episodeId) =>
        R.evolve({ [episodeId]: { isLikeFetching: R.T } }, state),
      [R.identity, R.prop('payload')],
    ),
    [RECEIVE_UNLIKE_EPISODE]: R.useWith(
      (state, { episodeId, userName }) =>
        R.evolve(
          {
            [episodeId]: {
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
    [UPDATE_EPISODE]: R.useWith(R.mergeDeepRight, [
      R.identity,
      R.path(['payload', 'episode']),
    ]),
    [REMOVE_EPISODES]: R.useWith(R.flip(R.omit), [
      R.identity,
      R.path(['payload', 'episodes']),
    ]),
    [SIGNOUT]: R.always({}),
  },
  {},
)

const allId = handleActions(
  {
    [RECEIVE_EPISODES]: R.useWith(R.union, [
      R.identity,
      R.pipe(
        R.prop('payload'),
        R.keys,
      ),
    ]),
    [REMOVE_EPISODES]: R.useWith(R.flip(R.without), [
      R.identity,
      R.path(['payload', 'episodes']),
    ]),
    [SIGNOUT]: R.always([]),
  },
  [],
)

const items = combineReducers({ byId, allId })

const isFetchingEpisodeComments = handleActions(
  {
    [REQUEST_EPISODE_COMMENTS]: R.useWith(
      (state, episodeId) => R.assoc(episodeId, true, state),
      [R.identity, R.prop('payload')],
    ),
    [RECEIVE_EPISODE_COMMENTS]: R.useWith(R.flip(R.dissoc), [
      R.identity,
      R.path(['payload', 'episodeId']),
    ]),
  },
  {},
)

const isFetchingEpisodes = handleActions(
  {
    [REQUEST_EPISODES]: R.T,
    [RECEIVE_EPISODES]: R.F,
  },
  false,
)

const fetching = combineReducers({
  isFetchingEpisodeComments,
  isFetchingEpisodes,
})

const localItems = handleActions(
  {
    [RECEIVE_RESTORE_EPISODES]: (_, { payload }) => payload,
    [EPISODE_LOADED]: R.useWith(R.merge, [R.identity, R.prop('payload')]),
    [REMOVE_LOCAL_EPISODE]: (state, { payload }) => R.dissoc(payload, state),
    [SIGNOUT]: R.always({}),
  },
  {},
)

const downloadTasks = handleActions(
  {
    [UPDATE_DOWNLOAD_TASK]: (state, action) => {
      const { episodeId, progress } = action.payload
      let newState = Object.assign({}, state)
      newState[episodeId] = {
        episodeId,
        progress,
      }
      return newState
    },
    [REMOVE_DOWNLOAD_TASK]: (state, action) => {
      const { episodeId } = action.payload
      let newState = Object.assign({}, state)
      if (newState[episodeId] !== undefined) {
        delete newState[episodeId]
      }
      return newState
    },
    [SIGNOUT]: R.always({}),
  },
  {},
)

const viewedEpisode = handleAction(
  SELECT_EPISODE,
  (_, { payload }) => payload,
  '',
)

export default combineReducers({
  items,
  fetching,
  localItems,
  downloadTasks,
  viewedEpisode,
})
