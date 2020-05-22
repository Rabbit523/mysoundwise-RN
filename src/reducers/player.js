import { handleActions, handleAction } from 'redux-actions'
import R from 'ramda'
import {
  ONLINE_PLAYER,
  OFFLINE_PLAYER,
  SIGNIN_PLAYER,
  SIGNOUT_PLAYER,
  PLAY_TRACK,
  PAUSE_TRACK,
  SET_CURRENT_TRACK_ID,
  SET_CURRENT_TIME,
  SET_DURATION,
  SET_SPEED_RATE,
  SET_PLAYLIST,
  SEEK_TIME,
  FETCH_TRACK,
  RESET_PLAYER,
  SET_PLAYLIST_ID,
  SET_LISTENING_SESSION,
  RESTORE_PLAY_POSITIONS,
  UPDATE_PLAY_POSITION,
} from '../actions'

const isOnline = handleActions(
  {
    [ONLINE_PLAYER]: R.T,
    [OFFLINE_PLAYER]: R.F,
  },
  false,
)

const isSignedIn = handleActions(
  {
    [SIGNIN_PLAYER]: R.T,
    [SIGNOUT_PLAYER]: R.F,
  },
  false,
)

const isPaused = handleActions(
  {
    [PLAY_TRACK]: R.F,
    [PAUSE_TRACK]: R.T,
  },
  true,
)

const isFetching = handleAction(FETCH_TRACK, (_, { payload }) => payload, false)

const seekTime = handleAction(SEEK_TIME, (_, { payload }) => payload, -1)

const currentTrackId = handleActions(
  {
    [SET_CURRENT_TRACK_ID]: (_, { payload }) => payload,
  },
  '',
)

const tracksPositions = handleActions(
  {
    [RESTORE_PLAY_POSITIONS]: (_, { payload }) => payload,
    [SET_CURRENT_TIME]: R.useWith(
      (state, { trackId, playPosition }) =>
        R.assocPath([trackId, 'playPosition'], playPosition, state),
      [R.identity, R.prop('payload')],
    ),
    [SET_DURATION]: R.useWith(
      (state, { trackId, duration }) =>
        R.assocPath([trackId, 'duration'], duration, state),
      [R.identity, R.prop('payload')],
    ),
    [UPDATE_PLAY_POSITION]: R.useWith(R.merge, [R.identity, R.prop('payload')]),
  },
  {},
)

const playlist = handleActions(
  {
    [SET_PLAYLIST]: (_, { payload }) => payload,
    [RESET_PLAYER]: R.always([]),
  },
  [],
)

const playlistId = handleAction(
  SET_PLAYLIST_ID,
  (_, { payload }) => payload,
  '',
)

const speedRate = handleAction(SET_SPEED_RATE, (_, { payload }) => payload, 1)

const isPlayerShown = handleActions(
  { [PLAY_TRACK]: R.T, [RESET_PLAYER]: R.F },
  false,
)

const listeningSession = handleAction(
  SET_LISTENING_SESSION,
  R.useWith(R.merge, [R.identity, R.prop('payload')]),
  {
    soundcastId: '',
    episodeId: '',
    publisherId: '',
    startPosition: 0,
  },
)

// export const initialState = {
//   isSignedIn: true,
//   playlist: [],
//   isPaused: true,
//   seekTime: -1,
//   speedRate: 1,
//   isFetching: false,
//   playlistId: '',
//   isPlayerShown: false,
//   currentTrackId: '',
//   tracksPositions: {},
//   listeningSession: {
//     episodeId: '',
//     publisherId: '',
//     soundcastId: '',
//     startPosition: 0,
//   },
// }

export default {
  isOnline,
  isSignedIn,
  playlist,
  isPaused,
  seekTime,
  speedRate,
  isFetching,
  playlistId,
  isPlayerShown,
  currentTrackId,
  tracksPositions,
  listeningSession,
}
