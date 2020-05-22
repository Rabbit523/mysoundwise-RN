import R from 'ramda'

export const getIsPlayerOnline = R.prop('isOnline')

export const getIsPlayerPaused = R.prop('isPaused')

export const getIsPlayerFetching = R.prop('isFetching')

export const getIsPlayerShown = R.prop('isPlayerShown')

export const getPlayerSpeedRate = R.prop('speedRate')

export const getPlayerSeekTime = R.prop('seekTime')

export const getCurrentTrackId = R.prop('currentTrackId')

export const getPlaylist = R.prop('playlist')

export const getPlaylistId = R.prop('playlistId')

export const getCurrentTrackIndex = R.converge(
  (id, playlist) => R.findIndex(R.propEq('trackId', id), playlist),
  [getCurrentTrackId, getPlaylist],
)

export const getCurrentTrack = R.converge(R.nth, [
  getCurrentTrackIndex,
  getPlaylist,
])

export const getNextTrack = R.converge(
  (index, playlist) =>
    index > 0 ? playlist[index - 1] : playlist[playlist.length - 1],
  [getCurrentTrackIndex, getPlaylist],
)

export const getPreviousTrack = R.converge(
  (index, playlist) =>
    index < playlist.length - 1 ? playlist[index + 1] : playlist[0],
  [getCurrentTrackIndex, getPlaylist],
)

export const getListeningSession = R.prop('listeningSession')

export const getTracksPositions = R.prop('tracksPositions')

export const getCurrentTrackPosition = R.converge(R.prop, [
  getCurrentTrackId,
  getTracksPositions,
])
