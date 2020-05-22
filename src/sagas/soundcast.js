import R from 'ramda'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { Alert } from 'react-native'
import {
  OPEN_SOUNDCAST_CHANNEL,
  CLOSE_SOUNDCAST_CHANNEL,
  REQUEST_EXPLORE_SOUNDCAST,
  removeEpisodes,
  updateSoundcast,
  requestEpisodes,
  requestPublishers,
  receivePublishers,
  receiveSoundcasts,
  receiveExploreSoundcast,
} from '../actions'
import {
  getSoundcastsById,
  getPublishersById,
  getUpdatedSoundcasts,
} from '../selectors'
import { createLiveChannel, mutateSoundcast, isExists } from '../utils'
import {
  EVENT_TYPES,
  ENTITY_SELECTOR_TYPES,
  EPISODES_REQUEST_TYPE,
} from '../constants'
import {
  getSoundcasts,
  getSoundcastInfo,
  getPublishersByIds,
  getSoundcastListeningSessionCount,
} from '../managers'

const soundcastHandler = function*(snapshot, soundcastId) {
  try {
    const newSoundcast = mutateSoundcast(snapshot.val())
    console.log('soundcastHandler: newSoundcast = ', newSoundcast)

    const publishersById = yield select(getPublishersById)
    const { publisherId } = newSoundcast

    if (!publishersById[publisherId]) {
      yield put(requestPublishers())
      const publishers = yield call(getPublishersByIds, [publisherId])
      yield put(receivePublishers(publishers))
    }

    const updatedSoundcasts = yield select(getUpdatedSoundcasts)
    if (!R.contains(soundcastId, updatedSoundcasts)) {
      yield all([
        put(
          updateSoundcast({
            [soundcastId]: newSoundcast,
          }),
        ),
        put(
          requestEpisodes({
            requestType: EPISODES_REQUEST_TYPE.BY_SOUNDCAST_ID,
            data: soundcastId,
          }),
        ),
      ])
    } else {
      const soundcasts = yield select(getSoundcastsById)
      const oldSoundcastEpisodes = R.pipe(
        R.path([soundcastId, 'episodes']),
        R.keys,
      )(soundcasts)
      const newSoundcastEpisodes = R.pipe(
        R.prop('episodes'),
        R.keys,
      )(newSoundcast)
      if (oldSoundcastEpisodes.length > newSoundcastEpisodes.length) {
        const diff = R.without(newSoundcastEpisodes, oldSoundcastEpisodes)
        yield put(removeEpisodes({ episodes: diff, soundcastId }))
      } else if (oldSoundcastEpisodes.length < newSoundcastEpisodes.length) {
        const diff = R.difference(newSoundcastEpisodes, oldSoundcastEpisodes)
        yield put(
          requestEpisodes({
            requestType: EPISODES_REQUEST_TYPE.BY_EPISODES_LIST,
            data: diff,
          }),
        )
      }
      yield put(
        updateSoundcast({
          [soundcastId]: R.pick(
            ['showSubscriberCount', 'subscribed', 'episodes'],
            newSoundcast,
          ),
        }),
      )
    }
  } catch (error) {
    console.warn(error)
    Alert.alert('Error', 'Failed to handle soundcast', [{ text: 'OK' }])
  }
}

const soundcastChannelConfig = {
  openChannelAction: OPEN_SOUNDCAST_CHANNEL,
  closeChannelAction: CLOSE_SOUNDCAST_CHANNEL,
  eventType: EVENT_TYPES.VALUE,
  handler: soundcastHandler,
  entitySelectorType: ENTITY_SELECTOR_TYPES.CHANNEL,
  firebasePaths: { beforeEntity: 'soundcasts' },
}

const handleExploreSoundcast = function*(snapshot, soundcastId) {
  try {
    const newSoundcast = mutateSoundcast(snapshot.val())

    const publishersById = yield select(getPublishersById)
    const { publisherId } = newSoundcast

    if (!publishersById[publisherId]) {
      yield put(requestPublishers())
      const publishers = yield call(getPublishersByIds, [publisherId])
      yield put(receivePublishers(publishers))
    }

    const listensCount = yield call(
      getSoundcastListeningSessionCount,
      soundcastId,
    )

    yield all([
      put(
        updateSoundcast({
          [soundcastId]: { ...newSoundcast, listensCount },
        }),
      ),
      put(
        requestEpisodes({
          requestType: EPISODES_REQUEST_TYPE.BY_SOUNDCAST_ID,
          data: soundcastId,
        }),
      ),
    ])
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to handle explore soundcast', [{ text: 'OK' }])
  }
}

const requestExploreSoundcastWorker = function*({ payload: soundcastId }) {
  try {
    const snapshot = yield call(getSoundcastInfo, soundcastId)
    if (snapshot.exists()) {
      yield call(handleExploreSoundcast, snapshot, soundcastId)

      const soundcast = snapshot.val()
      if (soundcast.bundle && isExists(soundcast.soundcastsIncluded)) {
        const soundcasts = yield call(
          getSoundcasts,
          soundcast.soundcastsIncluded,
        )
        yield put(receiveSoundcasts(soundcasts))
      }
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to load explore soundcast', [{ text: 'OK' }])
  }
  yield put(receiveExploreSoundcast())
}

const requestExploreSoundcastWatcher = function*() {
  yield takeLatest(REQUEST_EXPLORE_SOUNDCAST, requestExploreSoundcastWorker)
}

export default function*() {
  yield all([
    call(createLiveChannel, soundcastChannelConfig),
    call(requestExploreSoundcastWatcher),
  ])
}
