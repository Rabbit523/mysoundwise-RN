import R from 'ramda'
import { all, call, put, takeLatest, select } from 'redux-saga/effects'
import { Alert } from 'react-native'
import {
  REQUEST_USER_INFO,
  REQUEST_SUBSCRIBE,
  REQUEST_UNSUBSCRIBE,
  REQUEST_WEEK_STATISTICS,
  REQUEST_OTHER_USER_INFO,
  REQUEST_MONTH_STATISTICS,
  REQUEST_UPDATE_USER_INFO,
  OPEN_SUBSCRIPTIONS_CHANNEL,
  CLOSE_SUBSCRIPTIONS_CHANNEL,
  REQUEST_OTHER_WEEK_STATISTICS,
  REQUEST_OTHER_MONTH_STATISTICS,
  receiveLikes,
  receiveUserInfo,
  receiveListeners,
  receiveSubscribe,
  setUserSoundcasts,
  receiveUnsubscribe,
  receiveOtherUserInfo,
  requestUserSoundcasts,
  receiveUserSoundcasts,
  receiveWeekStatistics,
  requestWeekStatistics,
  requestMonthStatistics,
  receiveMonthStatistics,
  requestOtherWeekStatistics,
  receiveOtherWeekStatistics,
  requestOtherMonthStatistics,
  receiveOtherMonthStatistics,
} from '../actions'
import {
  subscribe,
  addMailChimp,
  updateUser,
  getUserInfo,
  unsubscribe,
  getSoundcasts,
  getLikesByUserId,
  getUserStatistics,
  uploadUserPicture,
} from '../managers'
import { getUserInfo as selectUserInfo, getSoundcastsAllId } from '../selectors'
import { USER, EVENT_TYPES, ENTITY_SELECTOR_TYPES } from '../constants'
import { createLiveChannel, renameKeys } from '../utils'
import firebase from 'react-native-firebase'

const requestUserInfoWorker = function*({ payload: userId }) {
  let userInfo = null
  try {
    yield all([
      put(requestWeekStatistics(userId)),
      put(requestMonthStatistics(userId)),
    ])
    userInfo = yield call(getUserInfo, userId)

    yield put(receiveListeners({ [userId]: { userId, ...userInfo } }))

    const likes = yield call(getLikesByUserId, userId)
    yield put(receiveLikes(likes))
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to load the user info', [{ text: 'OK' }])
  }
  yield put(receiveUserInfo(userInfo))
}

const requestUserInfoWatcher = function*() {
  yield takeLatest(REQUEST_USER_INFO, requestUserInfoWorker)
}

const requestOtherUserInfoWorker = function*({ payload: userId }) {
  let userInfo = null
  try {
    yield put(requestOtherWeekStatistics(userId))
    yield put(requestOtherMonthStatistics(userId))
    userInfo = yield call(getUserInfo, userId)
    yield put(
      receiveListeners({
        [userId]: R.pick(
          ['firstName', 'lastName', 'picUrl', 'bio', 'link'],
          userInfo,
        ),
      }),
    )
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to load the other user info', [{ text: 'OK' }])
  }
  yield put(receiveOtherUserInfo(userInfo))
}

const requestOtherUserInfoWatcher = function*() {
  yield takeLatest(REQUEST_OTHER_USER_INFO, requestOtherUserInfoWorker)
}

const requestUserUpdateInfoWorker = function*({
  payload: { updatedUser, userPictureFile },
}) {
  let newUser = R.clone(updatedUser)
  const userId = firebase.auth().currentUser.uid
  try {
    if (userPictureFile) {
      const picURL = yield call(uploadUserPicture, userPictureFile)
      if (picURL) newUser.picURL = picURL
    }
    yield call(updateUser, userId, newUser)
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to update the user info', [{ text: 'OK' }])
  }
  newUser = renameKeys({ picURL: 'picUrl' }, newUser)
  yield all([
    put(receiveUserInfo(newUser)),
    put(receiveListeners({ [userId]: newUser })),
  ])
}

const requestUserUpdateInfoWatcher = function*() {
  yield takeLatest(REQUEST_UPDATE_USER_INFO, requestUserUpdateInfoWorker)
}

const requestSubscribeWorker = function*({
  payload: { soundcastId, publisherId, mailChimp },
}) {
  const userId = firebase.auth().currentUser.uid
  try {
    // subscribe
    yield call(subscribe, {
      soundcastId,
      userId,
    })

    // add user to MailChimp
    const userInfo = yield select(selectUserInfo)
    if (
      mailChimp !== undefined &&
      publisherId !== undefined &&
      userInfo.email !== undefined
    ) {
      let user = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email[0],
      }
      yield call(addMailChimp, {
        publisherId,
        mailChimpInfo: mailChimp,
        user,
      })
    }
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to subscribe the soundcast', [{ text: 'OK' }])
  }
  yield put(receiveSubscribe())
}

const requestSubscribeWatcher = function*() {
  yield takeLatest(REQUEST_SUBSCRIBE, requestSubscribeWorker)
}

const requestUnsubscribeWorker = function*({ payload: { soundcastId } }) {
  const {
    publisherId,
    soundcasts: {
      [soundcastId]: { paymentId },
    },
  } = yield select(selectUserInfo)
  const userId = firebase.auth().currentUser.uid
  try {
    yield call(unsubscribe, { soundcastId, publisherId, userId, paymentId })
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to unsubscribe the soundcast', [
      { text: 'OK' },
    ])
  }
  yield put(receiveUnsubscribe(soundcastId))
}

const requestUnsubscribeWatcher = function*() {
  yield takeLatest(REQUEST_UNSUBSCRIBE, requestUnsubscribeWorker)
}

const STATISTICS_ACTIONS = {
  [USER.PERIOD.MONTH]: receiveMonthStatistics,
  [USER.PERIOD.OTHER_MONTH]: receiveOtherMonthStatistics,
  [USER.PERIOD.WEEK]: receiveWeekStatistics,
  [USER.PERIOD.OTHER_WEEK]: receiveOtherWeekStatistics,
}

const requestUserStatisticsWorker = function*(period, { payload }) {
  let statistics = null
  try {
    statistics = yield call(getUserStatistics, payload, period)
    statistics = {
      listened: statistics[0],
      likes: statistics[1],
      comments: statistics[2],
    }
  } catch (error) {
    // console.log(error)
  }
  yield put(STATISTICS_ACTIONS[period](statistics))
}

const requestUserStatisticsWatcher = function*() {
  yield all([
    takeLatest(
      REQUEST_MONTH_STATISTICS,
      requestUserStatisticsWorker,
      USER.PERIOD.MONTH,
    ),
    takeLatest(
      REQUEST_WEEK_STATISTICS,
      requestUserStatisticsWorker,
      USER.PERIOD.WEEK,
    ),
    takeLatest(
      REQUEST_OTHER_MONTH_STATISTICS,
      requestUserStatisticsWorker,
      USER.PERIOD.OTHER_MONTH,
    ),
    takeLatest(
      REQUEST_OTHER_WEEK_STATISTICS,
      requestUserStatisticsWorker,
      USER.PERIOD.OTHER_WEEK,
    ),
  ])
}

const subscriptionsHandler = function*(snapshot) {
  if (snapshot.exists()) {
    let userSoundcasts = R.filter(R.propEq('subscribed', true), snapshot.val())
    if (!R.isEmpty(userSoundcasts)) {
      try {
        yield put(setUserSoundcasts(userSoundcasts))
        const soundcastsKeys = R.keys(userSoundcasts)
        // const currentSoundcastsIds = yield select(getSoundcastsAllId)
        // const diff = R.difference(soundcastsKeys, currentSoundcastsIds)
        // if (diff.length) {
        yield put(requestUserSoundcasts())
        // userSoundcasts = yield call(getSoundcasts, diff)
        userSoundcasts = yield call(getSoundcasts, soundcastsKeys)
        // }
      } catch (error) {
        Alert.alert('Error', 'Failed to handle user subscribtion', [
          { text: 'OK' },
        ])
      }
    }
    yield put(receiveUserSoundcasts(userSoundcasts))
  }
}

const subscriptionsChannelConfig = {
  openChannelAction: OPEN_SUBSCRIPTIONS_CHANNEL,
  closeChannelAction: CLOSE_SUBSCRIPTIONS_CHANNEL,
  eventType: EVENT_TYPES.VALUE,
  handler: subscriptionsHandler,
  entitySelectorType: ENTITY_SELECTOR_TYPES.CHANNEL,
  firebasePaths: { beforeEntity: 'users', afterEntity: 'soundcasts' },
}

export default function*() {
  yield all([
    call(requestUserInfoWatcher),
    call(requestSubscribeWatcher),
    call(requestUnsubscribeWatcher),
    call(requestOtherUserInfoWatcher),
    call(requestUserUpdateInfoWatcher),
    call(requestUserStatisticsWatcher),
    call(createLiveChannel, subscriptionsChannelConfig),
  ])
}
