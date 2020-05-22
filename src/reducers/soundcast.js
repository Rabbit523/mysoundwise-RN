import { handleActions, handleAction, combineActions } from 'redux-actions'
import R from 'ramda'
import { combineReducers } from 'redux'
import {
  SIGNOUT,
  SELECT_SOUNDCAST,
  UPDATE_SOUNDCAST,
  RECEIVE_SOUNDCASTS,
  RECEIVE_USER_SOUNDCASTS,
  SELECT_EXPLORE_SOUNDCAST,
  RECEIVE_SEARCH_SOUNDCASTS,
  REQUEST_EXPLORE_SOUNDCAST,
  RECEIVE_EXPLORE_SOUNDCAST,
  RECEIVE_SOUNDCASTS_BY_CATEGORY,
  REMOVE_EPISODES,
  SELECT_BUNDLE_SOUNDCAST,
} from '../actions'

const byId = handleActions(
  {
    [REMOVE_EPISODES]: R.useWith(
      (state, { episodes, soundcastId }) =>
        R.evolve({ [soundcastId]: { episodes: R.omit(episodes) } }, state),
      [R.identity, R.prop('payload')],
    ),
    [combineActions(
      UPDATE_SOUNDCAST,
      RECEIVE_SOUNDCASTS,
      RECEIVE_USER_SOUNDCASTS,
      RECEIVE_SEARCH_SOUNDCASTS,
    )]: R.useWith(R.mergeDeepRight, [R.identity, R.prop('payload')]),
    [RECEIVE_SOUNDCASTS_BY_CATEGORY]: R.useWith(R.mergeDeepRight, [
      R.identity,
      R.path(['payload', 'soundcasts']),
    ]),
    [SIGNOUT]: R.always({}),
  },
  {},
)
// when update from firebase
const updated = handleActions(
  {
    [UPDATE_SOUNDCAST]: R.useWith(R.union, [
      R.identity,
      R.pipe(
        R.prop('payload'),
        R.keys,
      ),
    ]),
    [SIGNOUT]: R.always([]),
  },
  [],
)

const allId = handleActions(
  {
    [combineActions(
      RECEIVE_SOUNDCASTS,
      RECEIVE_USER_SOUNDCASTS,
      RECEIVE_SEARCH_SOUNDCASTS,
    )]: R.useWith(R.union, [
      R.identity,
      R.pipe(
        R.prop('payload'),
        R.keys,
      ),
    ]),
    [RECEIVE_SOUNDCASTS_BY_CATEGORY]: R.useWith(R.union, [
      R.identity,
      R.pipe(
        R.path(['payload', 'soundcasts']),
        R.keys,
      ),
    ]),
    [SIGNOUT]: R.always([]),
  },
  [],
)

const viewedSoundcast = handleAction(
  SELECT_SOUNDCAST,
  (_, { payload }) => payload,
  '',
)

const viewedExploreSoundcast = handleAction(
  SELECT_EXPLORE_SOUNDCAST,
  (_, { payload }) => payload,
  '',
)

const viewedBundleSoundcast = handleAction(
  SELECT_BUNDLE_SOUNDCAST,
  (_, { payload }) => payload,
  '',
)

const isFetchingExploreSoundcast = handleActions(
  {
    [REQUEST_EXPLORE_SOUNDCAST]: R.T,
    [RECEIVE_EXPLORE_SOUNDCAST]: R.F,
  },
  false,
)

const items = combineReducers({ byId, allId, updated })

export default combineReducers({
  items,
  viewedSoundcast,
  viewedBundleSoundcast,
  viewedExploreSoundcast,
  isFetchingExploreSoundcast,
})
