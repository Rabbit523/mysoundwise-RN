import R from 'ramda'
import { all, call, put, takeLatest, select, fork } from 'redux-saga/effects'
import {
  CHANGE_TRACK,
  SET_SPEED_RATE,
  REQUEST_PLAY_TRACK,
  REQUEST_PAUSE_TRACK,
  REQUEST_CONTINUE_TRACK,
  REQUEST_RESTORE_PLAY_POSITIONS,
  seekTime,
  playTrack,
  pauseTrack,
  setDuration,
  setPlaylist,
  setPlaylistId,
  setCurrentTime,
  setCurrentTrackId,
  requestPauseTrack,
  updatePlayPosition,
  setListeningSession,
  restorePlayPostions,
} from '../actions'
import { Platform, Alert } from 'react-native'
import {
  getPlaylist,
  getNextTrack,
  getPlaylistId,
  getCurrentTrack,
  getPreviousTrack,
  getCurrentTrackId,
  getTracksPositions,
  getListeningSession,
  getCurrentTrackPosition,
} from '../selectors'
import { increaseTotalListens, addListeningSession } from '../managers'
import { addPlayedEpisode, getPlayedEpisodes } from '../repositories'
import moment from 'moment'
import MusicControl from 'react-native-music-control'
import { setBackgroundPlayer } from '../utils'

const pausePlayingWorker = function*({ payload: holdBackgroundPlayer }) {
  yield put(pauseTrack())
  const trackPositions = yield select(getCurrentTrackPosition)
  if (!trackPositions) {
    return
  }
  const { playPosition: elapsedTime } = trackPositions
  console.log('zzzz: updatePlayback - PAUSED')
  MusicControl.updatePlayback({
    state: MusicControl.STATE_PAUSED,
    elapsedTime,
  })
  if (!holdBackgroundPlayer) {
    console.log('zzzz: resetNowPlaying...')
    MusicControl.resetNowPlaying()
  }
  try {
    const [trackId, trackPositions, listeningSession] = yield all([
      select(getCurrentTrackId),
      select(getCurrentTrackPosition),
      select(getListeningSession),
    ])
    if (!trackPositions) {
      return
    }
    const { playPosition, duration } = trackPositions
    const isListened = Math.trunc(duration) === Math.trunc(playPosition)
    if (isListened) {
      put(
        updatePlayPosition({
          [trackId]: {
            isListened,
          },
        }),
      )
    }
    yield all([
      call(addPlayedEpisode, trackId, {
        playPosition,
        isListened: isListened,
        duration,
      }),
      call(increaseTotalListens, trackId),
      call(
        addListeningSession,
        R.merge(listeningSession, {
          endPosition: Math.floor(playPosition),
          percentCompleted: Math.round((playPosition / duration) * 100),
        }),
      ),
    ])
  } catch (error) {
    console.log('zzzz: Failed to pause player: error.message = ', error.message)
    if (error.message !== 'Network Error') {
      console.log(
        'zzzz: Failed to pause player: error.response = ',
        error.response,
      )
      Alert.alert('Error', 'Failed to pause player', [{ text: 'OK' }])
    }
  }
}
const pausePlayingWatcher = function*() {
  yield takeLatest(REQUEST_PAUSE_TRACK, pausePlayingWorker)
}

const startPositionWorker = function*(trackId) {
  const playPositions = yield select(getTracksPositions)
  const {
    playPosition: oldPlayPosition,
    isListened,
    duration = 0,
  } = playPositions[trackId] ? playPositions[trackId] : {}
  const playPosition = isListened ? 0 : Math.floor(oldPlayPosition || 0)
  if (isListened) {
    yield all([
      call(addPlayedEpisode, trackId, { isListened: false, playPosition }),
      put(
        updatePlayPosition({
          [trackId]: { isListened: false },
        }),
      ),
      put(seekTime(0)),
    ])
  }
  return { playPosition, duration }
}

// FIXME: load all episodes on push NEW_EPISODE
const playPlayingWorker = function*({
  payload: {
    episodeId,
    soundcastId,
    soundcastEpisodes,
    trackImageUrl,
    publisherId,
  },
}) {
  try {
    const trackId = yield select(getCurrentTrackId)
    if (trackId === episodeId) {
      yield fork(continuePlayingWorker)
    } else {
      const playlistId = yield select(getPlaylistId)
      const { playPosition, duration } = yield call(
        startPositionWorker,
        episodeId,
      )
      yield all([
        put(setCurrentTime({ playPosition, trackId: episodeId })),
        put(setCurrentTrackId(episodeId)),
      ])
      if (duration) {
        yield put(setDuration({ duration, trackId: episodeId }))
      }
      let listeningSession = { episodeId, startPosition: playPosition }
      const playlist = yield select(getPlaylist)
      let newPlaylist = R.clone(playlist)
      if (
        soundcastId !== playlistId ||
        !R.find(R.propEq('trackId', episodeId), playlist)
      ) {
        listeningSession = { ...listeningSession, soundcastId, publisherId }
        yield put(setPlaylistId(soundcastId))
        newPlaylist = R.map(
          val => ({
            trackId: val.episodeId,
            trackUrl: val.isLoaded ? val.localPath : val.url,
            trackImageUrl,
            albumTitle: val.soundcastTitle,
            artist: val.publisherName,
            title: val.title,
            duration: val.duration,
            subtitle: moment.unix(val.date_created).format('ddd MMM DD'),
          }),
          soundcastEpisodes,
        )

        yield all([put(setPlaylist(newPlaylist))])
      }
      // android player bug
      if (Platform.OS === 'android') {
        yield call(() => new Promise(resolve => setTimeout(resolve, 0)))
      }
      if (playPosition) {
        yield put(seekTime(playPosition))
      }
      yield all([put(playTrack()), put(setListeningSession(listeningSession))])

      const track = R.find(R.propEq('trackId', episodeId), newPlaylist)
      if (track) {
        yield call(setBackgroundPlayer, track)
      }
    }
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to play track', [{ text: 'OK' }])
  }
}

const playPlayingWatcher = function*() {
  yield takeLatest(REQUEST_PLAY_TRACK, playPlayingWorker)
}

const continuePlayingWorker = function*() {
  try {
    const track = yield select(getCurrentTrack)
    const { trackId } = track
    const { playPosition } = yield call(startPositionWorker, trackId)
    yield all([
      put(setCurrentTime({ playPosition, trackId })),
      put(
        setListeningSession({
          startPosition: playPosition,
        }),
      ),
    ])
    // android player bug
    if (Platform.OS === 'android') {
      yield call(() => new Promise(resolve => setTimeout(resolve, 0)))
    }
    yield put(playTrack())
    yield call(setBackgroundPlayer, track)
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to continue playing the track', [
      { text: 'OK' },
    ])
  }
}

const continuePlayingWatcher = function*() {
  yield takeLatest(REQUEST_CONTINUE_TRACK, continuePlayingWorker)
}

const changeTrackWorker = function*({ payload: next }) {
  try {
    yield put(requestPauseTrack(true))

    const track = next
      ? yield select(getNextTrack)
      : yield select(getPreviousTrack)
    yield call(setBackgroundPlayer, track, MusicControl.STATE_BUFFERING)

    const { trackId } = track
    const { playPosition, duration } = yield call(startPositionWorker, trackId)
    const listeningSession = { episodeId: trackId, startPosition: playPosition }
    yield put(setCurrentTrackId(trackId))
    if (duration) {
      yield put(setDuration({ duration, trackId }))
    }
    if (Platform.OS === 'android') {
      yield call(() => new Promise(resolve => setTimeout(resolve, 0)))
    }
    if (playPosition) {
      yield put(seekTime(playPosition))
    }
    yield all([put(playTrack()), put(setListeningSession(listeningSession))])
    yield call(setBackgroundPlayer, track)
  } catch (error) {
    console.log('zzzz: error.message = ', error.message)
    console.log('zzzz: error.response = ', error.response)
    Alert.alert('Error', 'Failed to change track', [{ text: 'OK' }])
  }
}

const changeTrackWatcher = function*() {
  yield takeLatest(CHANGE_TRACK, changeTrackWorker)
}

const restorePlayPositionsWorker = function*() {
  const positions = yield call(getPlayedEpisodes)
  yield put(restorePlayPostions(positions))
}

const restorePlayPositionsWatcher = function*() {
  yield takeLatest(REQUEST_RESTORE_PLAY_POSITIONS, restorePlayPositionsWorker)
}

const speedRateWorker = function*({ payload: speedRate }) {
  yield call(MusicControl.updatePlayback, {
    speed: speedRate,
  })
}

const speedRateWatcher = function*() {
  yield takeLatest(SET_SPEED_RATE, speedRateWorker)
}

export default function*() {
  yield all([
    call(speedRateWatcher),
    call(changeTrackWatcher),
    call(playPlayingWatcher),
    call(pausePlayingWatcher),
    call(continuePlayingWatcher),
    call(restorePlayPositionsWatcher),
  ])
}
