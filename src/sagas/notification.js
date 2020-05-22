import R from 'ramda'
import { all, call } from 'redux-saga/effects'
import {
  setUserToken,
  removeUserToken,
  setTokenToSoundcasts,
  resetTokenToSoundcasts,
} from '../managers'
import firebase from 'react-native-firebase'

export const enableNotificationsWorker = function*() {
  try {
    const enabled = yield firebase.messaging().hasPermission()
    if (!enabled) {
      const accessGranted = yield firebase
        .messaging()
        .requestPermission()
        .then(R.T, R.F)
      if (!accessGranted) {
        return
      }
    }
    const userId = yield firebase.auth().currentUser.uid
    const token = yield firebase.messaging().getToken()
    yield all([
      call(setUserToken, userId, token),
      call(setTokenToSoundcasts, userId, token),
    ])

    // TODO: send token to the node server!
  } catch (error) {
    // TODO: handle error
    // console.log(error)
  }
}

export const disableNotificationsWorker = function*() {
  // TODO: unsubscribe
  const userId = firebase.auth().currentUser.uid
  try {
    yield all([
      call(removeUserToken, userId),
      call(resetTokenToSoundcasts, userId),
    ])
  } catch (error) {
    // console.log(error)
  }
}
