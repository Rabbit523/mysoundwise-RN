import { createAction } from 'redux-actions'

// Action Types

export const REQUEST_EXPLORE_SOUNDCAST =
  'soundwise/soundcast/REQUEST_EXPLORE_SOUNDCAST'

export const RECEIVE_EXPLORE_SOUNDCAST =
  'soundwise/soundcast/RECEIVE_EXPLORE_SOUNDCAST'

export const UPDATE_SOUNDCAST = 'soundwise/soundcast/UPDATE_SOUNDCAST'

export const RECEIVE_SOUNDCASTS = 'soundwise/soundcast/RECEIVE_SOUNDCASTS'

export const SELECT_SOUNDCAST = 'soundwise/soundcast/SELECT_SOUNDCAST'

export const SELECT_EXPLORE_SOUNDCAST =
  'soundwise/soundcast/SELECT_EXPLORE_SOUNDCAST'

export const SELECT_BUNDLE_SOUNDCAST =
  'soundwise/soundcast/SELECT_BUNDLE_SOUNDCAST'

export const OPEN_SOUNDCAST_CHANNEL =
  'soundwise/soundcast/OPEN_SOUNDCAST_CHANNEL'

export const CLOSE_SOUNDCAST_CHANNEL =
  'soundwise/soundcast/CLOSE_SOUNDCAST_CHANNEL'

// Action Creators

export const requestExploreSoundcast = createAction(REQUEST_EXPLORE_SOUNDCAST)

export const receiveExploreSoundcast = createAction(RECEIVE_EXPLORE_SOUNDCAST)

export const updateSoundcast = createAction(UPDATE_SOUNDCAST)

export const receiveSoundcasts = createAction(RECEIVE_SOUNDCASTS)

export const selectSoundcast = createAction(SELECT_SOUNDCAST)

export const selectExploreSoundcast = createAction(SELECT_EXPLORE_SOUNDCAST)

export const selectBundleSoundcast = createAction(SELECT_BUNDLE_SOUNDCAST)

export const openSoundcastChannel = createAction(OPEN_SOUNDCAST_CHANNEL)

export const closeSoundcastChannel = createAction(CLOSE_SOUNDCAST_CHANNEL)
