import { createAction } from 'redux-actions'

// Action Types

export const ONLINE_PLAYER = 'soundwise/player/ONLINE'

export const OFFLINE_PLAYER = 'soundwise/player/OFFLINE'

export const SIGNIN_PLAYER = 'soundwise/player/SIGNIN'

export const SIGNOUT_PLAYER = 'soundwise/player/SIGNOUT'

export const PLAY_TRACK = 'soundwise/player/PLAY_TRACK'

export const REQUEST_PLAY_TRACK = 'soundwise/player/REQUEST_PLAY_TRACK'

export const REQUEST_CONTINUE_TRACK = 'soundwise/player/REQUEST_CONTINUE_TRACK'

export const PAUSE_TRACK = 'soundwise/player/PAUSE_TRACK'

export const REQUEST_PAUSE_TRACK = 'soundwise/player/REQUEST_PAUSE_TRACK'

export const SET_CURRENT_TIME = 'soundwise/player/SET_CURRENT_TIME'

export const SEEK_TIME = 'soundwise/player/SEEK_TIME'

export const SET_CURRENT_TRACK_ID = 'soundwise/player/SET_CURRENT_TRACK_ID'

export const SET_PLAYLIST = 'soundwise/player/SET_PLAYLIST'

export const SET_DURATION = 'soundwise/player/SET_DURATION'

export const SET_SPEED_RATE = 'soundwise/player/SET_SPEED_RATE'

export const FETCH_TRACK = 'soundwise/player/FETCH_TRACK'

export const UPDATE_TRACK = 'soundwise/player/UPDATE_TRACK'

export const RESET_PLAYER = 'soundwise/player/RESET_PLAYER'

export const CHANGE_TRACK = 'soundwise/player/CHANGE_TRACK'

export const SET_PLAYLIST_ID = 'soundwise/player/SET_PLAYLIST_ID'

export const SET_LISTENING_SESSION = 'soundwise/player/SET_LISTENING_SESSION'

export const REQUEST_RESTORE_PLAY_POSITIONS =
  'soundwise/player/REQUEST_RESTORE_PLAY_POSITIONS'

export const RESTORE_PLAY_POSITIONS = 'soundwise/player/RESTORE_PLAY_POSITIONS'

export const UPDATE_PLAY_POSITION = 'soundwise/player/UPDATE_PLAY_POSITION'

// Action Creators

export const onlinePlayer = createAction(ONLINE_PLAYER)

export const offlinePlayer = createAction(OFFLINE_PLAYER)

export const signinPlayer = createAction(SIGNIN_PLAYER)

export const signoutPlayer = createAction(SIGNOUT_PLAYER)

export const pauseTrack = createAction(PAUSE_TRACK)

export const seekTime = createAction(SEEK_TIME)

export const playTrack = createAction(PLAY_TRACK)

export const requestPlayTrack = createAction(REQUEST_PLAY_TRACK)

export const requestContinueTrack = createAction(REQUEST_CONTINUE_TRACK)

export const requestPauseTrack = createAction(REQUEST_PAUSE_TRACK)

export const setCurrentTime = createAction(SET_CURRENT_TIME)

export const setCurrentTrackId = createAction(SET_CURRENT_TRACK_ID)

export const setPlaylist = createAction(SET_PLAYLIST)

export const setDuration = createAction(SET_DURATION)

export const setSpeedRate = createAction(SET_SPEED_RATE)

export const fetchTrack = createAction(FETCH_TRACK)

export const updateTrack = createAction(UPDATE_TRACK)

export const resetPlayer = createAction(RESET_PLAYER)

export const changeTrack = createAction(CHANGE_TRACK)

export const setPlaylistId = createAction(SET_PLAYLIST_ID)

export const setListeningSession = createAction(SET_LISTENING_SESSION)

export const requestRestorePlayPostions = createAction(
  REQUEST_RESTORE_PLAY_POSITIONS,
)

export const restorePlayPostions = createAction(RESTORE_PLAY_POSITIONS)

export const updatePlayPosition = createAction(UPDATE_PLAY_POSITION)
