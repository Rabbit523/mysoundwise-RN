import firebase from 'react-native-firebase'
import R from 'ramda'
import moment from 'moment'
import API, { TEST_BASE_URL } from '../api'
import { USER } from '../constants'
import axios from 'axios'
import { mutateUser, params } from '../utils'

export const completeSignUp = ({
  email,
  firstName,
  lastName,
  pic_url: picUrl,
}) =>
  axios.post(API.COMPLETE_SING_UP, {
    email,
    firstName,
    lastName,
    picUrl,
  })

export const getUserInfo = userId =>
  firebase
    .database(TEST_BASE_URL)
    .ref(`users/${userId}`)
    .once('value')
    .then(snapshot => mutateUser(snapshot.val()))

export const updateUser = (userId, userData) =>
  axios.patch(API.LISTENER_BY_ID(userId), userData)

export const uploadUserPicture = file => {
  const data = new FormData()
  data.append('file', file, file.name)

  return axios.post(API.UPLOAD_AVATAR, data).then(res => {
    const url = res.data[0].url
    return url.startsWith('https') ? url : url.replace(/http/i, 'https')
  })
}

const getFilter = (userId, period) => ({
  params: params()
    .startParam('where')
    .addProp('userId', userId)
    .addProp('createdAt', {
      gte:
        period === USER.PERIOD.WEEK || period === USER.PERIOD.OTHER_WEEK
          ? moment()
              .startOf('week')
              .utc()
              .format()
          : moment()
              .startOf('month')
              .utc()
              .format(),
    })
    .end(),
})

const getUserListensCount = (userId, period) =>
  axios
    .get(API.GET_LISTENS_COUNT, getFilter(userId, period))
    .then(res => res.data.count)
    .catch(R.always(0))

const getUserLikesCount = (userId, period) =>
  axios
    .get(API.GET_LIKES_COUNT, getFilter(userId, period))
    .then(res => res.data.count)
    .catch(R.always(0))

const getUserCommentsCount = (userId, period) =>
  axios
    .get(API.GET_COMMENTS_COUNT, getFilter(userId, period))
    .then(res => res.data.count)
    .catch(R.always(0))

export const getUserStatistics = (userId, period) =>
  Promise.all([
    getUserListensCount(userId, period),
    getUserLikesCount(userId, period),
    getUserCommentsCount(userId, period),
  ])

export const unsubscribe = data => axios.post(API.UNSUBSCRIBE, data)

export const subscribe = data => axios.post(API.SUBSCRIBE, data)

export const addMailChimp = data => axios.post(API.ADD_MAILCHIMP, data)

export const getUserTokens = userId =>
  firebase
    .database(TEST_BASE_URL)
    .ref(`users/${userId}/token`)
    .once('value')
    .then(snapshot => (snapshot.exists() ? snapshot.val() : []))

export const setTokenToSoundcasts = (userId, token) =>
  firebase
    .database(TEST_BASE_URL)
    .ref(`users/${userId}/soundcasts`)
    .once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        const subscribed = R.pipe(
          R.filter(R.propEq('subscribed', true)),
          R.keys,
        )(snapshot.val())
        return Promise.all(
          R.map(
            soundcastId =>
              firebase
                .database(TEST_BASE_URL)
                .ref(`soundcasts/${soundcastId}/subscribed/${userId}`)
                .set([token]),
            subscribed,
          ),
        )
      }
    })

export const removeUserToken = userId =>
  firebase
    .database(TEST_BASE_URL)
    .ref(`users/${userId}/token`)
    .set(null)

export const setUserToken = (userId, token) =>
  firebase
    .database(TEST_BASE_URL)
    .ref(`users/${userId}/token`)
    .set([token])

export const resetTokenToSoundcasts = userId =>
  firebase
    .database(TEST_BASE_URL)
    .ref(`users/${userId}/soundcasts`)
    .once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        const subscribed = R.pipe(
          R.filter(R.propEq('subscribed', true)),
          R.keys,
        )(snapshot.val())
        return Promise.all(
          R.map(
            soundcastId =>
              firebase
                .database(TEST_BASE_URL)
                .ref(`soundcasts/${soundcastId}/subscribed/${userId}`)
                .set(false),
            subscribed,
          ),
        )
      }
    })
