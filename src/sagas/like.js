import R from 'ramda'
import { Alert } from 'react-native'
import { call, put, takeLatest } from 'redux-saga/effects'
import { REQUEST_LIKES, receiveLikes, receiveListeners } from '../actions'
import { getEntityLikes, getListeners } from '../managers'

const requestLikesWorker = function*({ payload: { entityId, entityType } }) {
  let listeners = {},
    likes = {}
  try {
    likes = yield call(getEntityLikes, entityId, entityType)
    if (!R.isEmpty(likes)) {
      listeners = yield call(
        getListeners,
        R.pipe(
          R.map(R.prop('userId')),
          R.values,
        )(likes),
      )
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to fetch likes', [{ text: 'OK' }])
  }
  yield put(receiveListeners(listeners))
  yield put(receiveLikes(likes))
}

const requestLikesWatcher = function*() {
  yield takeLatest(REQUEST_LIKES, requestLikesWorker)
}

export default function*() {
  yield call(requestLikesWatcher)
}
