import { Alert } from 'react-native'
import firebase from 'react-native-firebase'
import SplashScreen from 'react-native-splash-screen'
import {
  all,
  call,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'
import {
  SIGNIN,
  SIGNOUT,
  REQUEST_SIGNUP,
  FACEBOOK_CONNECT,
  DISPATCH_AFTER_AUTH,
  CHECK_IF_AUTHORIZED,
  REQUEST_IDENTIFICATION,
  REQUEST_AUTHENTIFICATION,
  signin,
  selectUser,
  receiveSignup,
  receiveUserInfo,
  requestUserInfo,
  facebookConnected,
  receiveIdentification,
  requestRestoreEpisodes,
  receiveAuthentification,
  openSubscriptionsChannel,
  closeSubscriptionsChannel,
  requestRestorePlayPostions,
} from '../actions'
import { AUTH } from '../constants'
import {
  completeSignUp,
  firebaseSignOut,
  facebookSignOut,
  findUserByEmail,
  showFacebookModal,
  checkIfUserExists,
  removeLocalEpisodes,
  signInWithCredential,
  getUserInfoFromFacebook,
  signInWithEmailAndPassword,
  signUpWithEmailAndPassword,
} from '../managers'
import * as NavigationService from '../NavigationService'
import { getLoadedEpisodes, removeLoadedEpisodes } from '../repositories'
import { getIsOnline, getIsSignedIn } from '../selectors'
import { capitalizeFirstLetter } from '../utils'
import {
  disableNotificationsWorker,
  enableNotificationsWorker,
} from './notification'

// workaround for IOS @see https://github.com/facebook/react-native/issues/8615

const signInWorker = function*() {
  const uid = firebase.auth().currentUser.uid
  yield put(openSubscriptionsChannel(uid))
  yield put(selectUser(uid))
  yield put(requestUserInfo(uid))
  yield put(requestRestoreEpisodes())
  yield put(requestRestorePlayPostions())
  yield call(NavigationService.navigate, 'Main')
  yield put(signin(uid))
  yield call(SplashScreen.hide)
  yield call(enableNotificationsWorker)
}

const facebookConnectWorker = function*() {
  const isConnected = yield select(getIsOnline)
  if (!isConnected) {
    yield put(facebookConnected())
    Alert.alert('Connection Error', 'Please check your Internet connection', [
      { text: 'OK' },
    ])
    return
  }
  try {
    const token = yield call(showFacebookModal)
    if (token) {
      const credential = firebase.auth.FacebookAuthProvider.credential(
        token.accessToken,
      )
      yield call(signInWithCredential, credential)
      yield put(requestUserInfo(firebase.auth().currentUser.uid))
      const isUserExists = yield call(checkIfUserExists)
      // if first time connect and data doesnt exist
      if (!isUserExists) {
        const userInfo = yield call(getUserInfoFromFacebook, token)
        yield all([
          put(receiveUserInfo(userInfo)),
          call(completeSignUp, userInfo),
        ])
      }
      yield call(signInWorker)
    }
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to connect with Facebook', [{ text: 'OK' }])
  }
  yield put(facebookConnected())
}

const facebookConnectWatcher = function*() {
  yield takeLatest(FACEBOOK_CONNECT, facebookConnectWorker)
}

const ERROR_CODES = {
  WRONG_PASSWORD: 'auth/wrong-password',
  NO_USER: 'auth/user-not-found',
}

const identificationWorker = function*({ payload }) {
  const isConnected = yield select(getIsOnline)
  if (!isConnected) {
    yield put(receiveIdentification(AUTH.PROCESS.NO_REQUEST))
    Alert.alert('Connection Error', 'Please check your Internet connection', [
      { text: 'OK' },
    ])
    return
  }
  const result = yield call(findUserByEmail, payload)
  if (result.code === ERROR_CODES.NO_USER) {
    yield put(receiveIdentification(AUTH.PROCESS.NO))
  } else if (result.code === ERROR_CODES.WRONG_PASSWORD) {
    yield put(receiveIdentification(AUTH.PROCESS.YES))
  } else {
    yield put(receiveIdentification(AUTH.PROCESS.NO_REQUEST))
  }
}

const identificationWatcher = function*() {
  yield takeLatest(REQUEST_IDENTIFICATION, identificationWorker)
}

const authentificationWorker = function*({ payload: { email, password } }) {
  // const isConnected = yield select(getIsOnline)
  // if (!isConnected) {
  //   yield put(receiveAuthentification(AUTH.PROCESS.NO_REQUEST))
  //   return
  // }
  let result = AUTH.PROCESS.NO
  try {
    yield call(signInWithEmailAndPassword, email, password)
    if (firebase.auth().currentUser) {
      result = AUTH.PROCESS.YES
      yield put(requestUserInfo(firebase.auth().currentUser.uid))
      yield call(signInWorker)
    }
  } catch (error) {
    // console.log(error)
  }
  yield put(receiveAuthentification(result))
}

const authentificationWatcher = function*() {
  yield takeLatest(REQUEST_AUTHENTIFICATION, authentificationWorker)
}

const signOutWorker = function*() {
  yield call(NavigationService.navigate, 'Login')
  try {
    const localEpisodes = yield call(getLoadedEpisodes)
    yield call(disableNotificationsWorker)
    yield all([
      put(closeSubscriptionsChannel()),
      call(removeLoadedEpisodes),
      call(firebaseSignOut),
      call(facebookSignOut),
      call(removeLocalEpisodes, localEpisodes),
    ])
    // yield put({
    //   type: PURGE,
    //   key: 'root',
    //   result: () => null
    // })
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to sign out', [{ text: 'OK' }])
  }
}

const signOutWatcher = function*() {
  yield takeLatest(SIGNOUT, signOutWorker)
}

const signUpWorker = function*({
  payload: { email, password, firstName, lastName },
}) {
  const isConnected = yield select(getIsOnline)
  if (!isConnected) {
    yield put(receiveSignup())
    Alert.alert('Connection Error', 'Please check your Internet connection', [
      { text: 'OK' },
    ])
    return
  }
  try {
    yield call(signUpWithEmailAndPassword, email, password)

    const userInfo = {
      firstName: capitalizeFirstLetter(firstName.trim()),
      lastName: capitalizeFirstLetter(lastName.trim()),
      email: email.trim().toLowerCase(),
    }

    yield call(completeSignUp, userInfo)

    yield put(receiveUserInfo(userInfo))
    yield call(signInWorker)
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to sign up', [{ text: 'OK' }])
  }
  yield put(receiveSignup())
}

const signUpWatcher = function*() {
  yield takeLatest(REQUEST_SIGNUP, signUpWorker)
}

const checkAuthWathcer = function*() {
  yield takeLatest(CHECK_IF_AUTHORIZED, checkAuthWorker)
}

const checkAuthWorker = function*() {
  // const isConnected = yield select(getIsOnline)
  // if (!isConnected) {
  //   yield call(SplashScreen.hide)
  //   return
  // }
  yield new Promise(res => {
    const unsubscribe = firebase.auth().onAuthStateChanged(() => {
      res()
      unsubscribe && unsubscribe()
    })
  })
  const signedIn = yield select(getIsSignedIn)
  if (signedIn && firebase.auth().currentUser) {
    yield call(signInWorker)
  } else {
    yield call(SplashScreen.hide)
  }
}

const dispatchAfterAuthWorker = function*({
  payload: { actionCreator, payload },
}) {
  const signedIn = yield select(getIsSignedIn)
  if (signedIn) {
    yield put(actionCreator(payload))
  } else {
    yield take(SIGNIN)
    yield put(actionCreator(payload))
  }
}

const dispatchAfterAuthWatcher = function*() {
  yield takeEvery(DISPATCH_AFTER_AUTH, dispatchAfterAuthWorker)
}

export default function*() {
  yield all([
    call(signUpWatcher),
    call(signOutWatcher),
    call(checkAuthWathcer),
    call(identificationWatcher),
    call(facebookConnectWatcher),
    call(authentificationWatcher),
    call(dispatchAfterAuthWatcher),
  ])
}
