import R from 'ramda'
import { all, call, put, takeLatest, select } from 'redux-saga/effects'
import { Alert } from 'react-native'
import {
  REQUEST_UPDATES,
  REFRESH_UPDATES,
  PREPARE_FOR_TRANSITION,
  selectEpisode,
  selectMessage,
  receiveUpdates,
  replaceUpdates,
  selectSoundcast,
  receiveEpisodes,
  finishPreparing,
  receiveMessages,
  requestListeners,
  receiveListeners,
  selectSubscription,
  receiveUserSoundcasts,
} from '../actions'
import {
  getUpdates,
  getListeners,
  getEpisodeById,
  getMessageById,
  getSoundcastById,
} from '../managers'
import {
  getUpdatesPage,
  getMessagesById,
  getSoundcastsById,
  getPublishedEpisodes,
  getUpdatedSoundcasts,
  getListenerItemsById,
  getIsUpdatesPagesEnded,
} from '../selectors'
import firebase from 'react-native-firebase'
import { PAGINATION_LIMITS, UPDATE_TYPES } from '../constants'
import * as NavigationService from '../NavigationService'

const requestUpdatesWorker = function*() {
  const isPagesEnded = yield select(getIsUpdatesPagesEnded)
  let updates = {}
  if (!isPagesEnded) {
    try {
      const page = yield select(getUpdatesPage)
      const userId = firebase.auth().currentUser.uid
      updates = yield call(getUpdates, userId, page, PAGINATION_LIMITS.UPDATES)
    } catch (error) {
      Alert.alert('Error', 'Failed to load updates', [{ text: 'OK' }])
    }
  }
  yield put(receiveUpdates(updates))
}

const requestUpdatesWatcher = function*() {
  yield takeLatest(REQUEST_UPDATES, requestUpdatesWorker)
}

const refreshUpdatesWorker = function*() {
  const userId = firebase.auth().currentUser.uid
  let updates = {}
  try {
    updates = yield call(getUpdates, userId, 0, PAGINATION_LIMITS.UPDATES)
  } catch (error) {
    Alert.alert('Error', 'Failed to refresh updates', [{ text: 'OK' }])
  }
  yield put(replaceUpdates(updates))
}

const refreshUpdatesWatcher = function*() {
  yield takeLatest(REFRESH_UPDATES, refreshUpdatesWorker)
}

const transitionToEpisodeWorker = function*({ payload }) {
  const { type, fromNotification } = payload
  try {
    if (
      type === UPDATE_TYPES.COMMENT_EPISODE ||
      type === UPDATE_TYPES.LIKE_EPISODE ||
      type === UPDATE_TYPES.NEW_EPISODE ||
      type === UPDATE_TYPES.LIKE_EPISODE_COMMENT
    ) {
      const { soundcastId, episodeId } = payload
      if (!soundcastId || !episodeId) {
        yield put(finishPreparing())
        return
      }
      const [soundcasts, updatedSoundcasts, episodes] = yield all([
        select(getSoundcastsById),
        select(getUpdatedSoundcasts),
        select(getPublishedEpisodes),
      ])
      if (
        !soundcasts[soundcastId] ||
        !R.contains(soundcastId, updatedSoundcasts)
      ) {
        const soundcast = yield call(getSoundcastById, soundcastId)
        yield put(receiveUserSoundcasts({ [soundcastId]: soundcast }))
      }
      if (!episodes[episodeId]) {
        let episode = yield call(getEpisodeById, episodeId)
        yield put(receiveEpisodes(episode))
      }
      yield all([
        put(selectEpisode(episodeId)),
        put(selectSoundcast(soundcastId)),
      ])
      yield call(NavigationService.navigate, 'EpisodeDetails', {
        openEpisodeChannel: true,
        key: !fromNotification && 'Update',
      })
    } else if (
      type === UPDATE_TYPES.COMMENT_MESSAGE ||
      type === UPDATE_TYPES.LIKE_MESSAGE ||
      type === UPDATE_TYPES.NEW_MESSAGE ||
      type === UPDATE_TYPES.LIKE_MESSAGE_COMMENT
    ) {
      const { announcementId: messageId, soundcastId } = payload
      if (!soundcastId || !messageId) {
        yield put(finishPreparing())
        return
      }
      const messages = yield select(getMessagesById)
      let message = messages[messageId]
      if (!message) {
        message = yield call(getMessageById, messageId)
        yield put(receiveMessages({ [messageId]: message }))
      }
      const listeners = yield select(getListenerItemsById)
      let listener = listeners[message.creatorId]
      let listenerBody
      if (!listener) {
        yield put(requestListeners())
        listener = yield call(getListeners, [message.creatorId])
        yield put(receiveListeners(listener))
        listenerBody = R.pipe(
          R.values,
          R.head,
        )(listener)
      } else {
        listenerBody = listener
      }
      const { firstName, lastName, picUrl } = listenerBody
      yield all([
        put(selectMessage(messageId)),
        put(selectSubscription(soundcastId)),
      ])
      yield call(NavigationService.navigate, 'MessageDetails', {
        dateCreated: message.timeStamp,
        publisherName: [firstName, lastName].join(' '),
        publisherImageUrl: picUrl,
        key: !fromNotification && 'Update',
      })
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to transition', [{ text: 'OK' }])
  }
  yield put(finishPreparing())
}

const transitionToEpisodeWatcher = function*() {
  yield takeLatest(PREPARE_FOR_TRANSITION, transitionToEpisodeWorker)
}

export default function*() {
  yield all([
    call(requestUpdatesWatcher),
    call(transitionToEpisodeWatcher),
    call(refreshUpdatesWatcher),
  ])
}
