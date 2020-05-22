import R from 'ramda'
import { Alert } from 'react-native'
import { all, call, put, takeLatest, select } from 'redux-saga/effects'
import {
  COMMENT_MESSAGE,
  REQUEST_MESSAGES,
  REFRESH_MESSAGES,
  UNCOMMENT_MESSAGE,
  REQUEST_LIKE_MESSAGE,
  REQUEST_UNLIKE_MESSAGE,
  REQUEST_MESSAGE_COMMENTS,
  REQUEST_REFRESH_MESSAGE_COMMENTS,
  receiveLikes,
  requestMessages,
  receiveMessages,
  receiveListeners,
  requestListeners,
  receiveLikeMessage,
  receiveUnlikeMessage,
  receiveMessageComments,
  receiveRefreshMessageComments,
} from '../actions'
import {
  likeEntity,
  unlikeEntity,
  getListeners,
  commentEntity,
  getMessageById,
  uncommentEntity,
  getLikesByMessageIds,
  getMessagesBySoundcastId,
  getEntityLikes,
} from '../managers'
import {
  getUserFullName,
  getCommentItemsById,
  getListenerItemsAllId,
  getViewedSubscription,
} from '../selectors'
import firebase from 'react-native-firebase'
import moment from 'moment'
import { renameKeys, getMessageComments, removeUserEntityLikes } from '../utils'
import { ENTITIES } from '../constants'

const requestMessagesWorker = function*({ payload: soundcastId }) {
  let messages = {}
  try {
    messages = yield call(getMessagesBySoundcastId, soundcastId)
    if (!R.isEmpty(messages)) {
      const allListeners = yield select(getListenerItemsAllId)
      const publishers = R.pipe(
        R.map(R.prop('creatorId')),
        R.values,
        R.uniq,
        R.difference(R.__, allListeners),
      )(messages)
      if (publishers.length) {
        yield put(requestListeners())
        const listeners = yield call(getListeners, publishers)
        yield put(receiveListeners(listeners))
      }

      const messageIds = R.keys(messages)
      const likes = yield call(getLikesByMessageIds, messageIds)
      yield call(removeUserEntityLikes, likes, messageIds, ENTITIES.MESSAGE)
      yield put(receiveLikes(likes))
    }
  } catch (error) {
    // console.log(error)s
    Alert.alert('Error', 'Failed to load messages', [{ text: 'OK' }])
  }
  yield put(receiveMessages(messages))
}

const requestMessagesWatcher = function*() {
  yield takeLatest(REQUEST_MESSAGES, requestMessagesWorker)
}

const refreshMessagesWorker = function*() {
  const viewedSubscription = yield select(getViewedSubscription)
  if (viewedSubscription) {
    yield put(requestMessages(viewedSubscription))
  } else {
    yield put(receiveMessages({}))
  }
}

const refreshMessagesWatcher = function*() {
  yield takeLatest(REFRESH_MESSAGES, refreshMessagesWorker)
}

const likeMessageWorker = function*({ payload: { messageId, soundcastId } }) {
  try {
    const userName = yield select(getUserFullName)
    const userId = firebase.auth().currentUser.uid
    const likeId = `${userId}-${messageId}`
    const likeObject = {
      likeId,
      announcementId: messageId,
      soundcastId,
      timeStamp: moment().unix(),
      userId,
      fullName: userName,
    }
    yield all([
      call(likeEntity, likeObject),
      put(receiveLikeMessage({ messageId, userName })),
      put(receiveLikes({ [likeId]: likeObject })),
    ])
  } catch (error) {
    Alert.alert('Error', 'Failed to like the message', [{ text: 'OK' }])
  }
}

const likeMessageWatcher = function*() {
  yield takeLatest(REQUEST_LIKE_MESSAGE, likeMessageWorker)
}

const unlikeMessageWorker = function*({ payload: messageId }) {
  try {
    const uid = firebase.auth().currentUser.uid
    const likeId = `${uid}-${messageId}`
    let lastLikedName = yield call(unlikeEntity, likeId)
    if (!lastLikedName) {
      lastLikedName = 'Guest'
    }
    yield put(
      receiveUnlikeMessage({
        [likeId]: {
          messageId,
          userName: lastLikedName,
        },
      }),
    )
  } catch (error) {
    Alert.alert('Error', 'Failed to unlike the message', [{ text: 'OK' }])
  }
}

const unlikeMessageWatcher = function*() {
  yield takeLatest(REQUEST_UNLIKE_MESSAGE, unlikeMessageWorker)
}

const commentMessageWorker = function*({ payload }) {
  try {
    const commentObject = R.pipe(
      R.omit(['likesCount', 'userCreated', 'userLiked']),
      renameKeys({ messageId: 'announcementId', creatorId: 'userId' }),
    )(payload)
    yield call(commentEntity, commentObject)
  } catch (error) {
    Alert.alert('Error', 'Failed to comment the message', [{ text: 'OK' }])
  }
}

const commentMessageWatcher = function*() {
  yield takeLatest(COMMENT_MESSAGE, commentMessageWorker)
}

const uncommentMessageWorker = function*({ payload: { commentId } }) {
  try {
    yield call(uncommentEntity, commentId)
  } catch (error) {
    Alert.alert('Error', 'Failed to delete the comment', [{ text: 'OK' }])
  }
}

const uncommentMessageWatcher = function*() {
  yield takeLatest(UNCOMMENT_MESSAGE, uncommentMessageWorker)
}

const requestMessageCommentsWorker = function*({ payload: messageId }) {
  let comments = {}
  try {
    comments = yield call(getMessageComments, messageId)
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to fetch message comments', [{ text: 'OK' }])
  }
  yield put(receiveMessageComments({ comments, messageId }))
}

const requestMessageCommentsWatcher = function*() {
  yield takeLatest(REQUEST_MESSAGE_COMMENTS, requestMessageCommentsWorker)
}

const requestRefreshMessageCommentsWorker = function*({ payload: messageId }) {
  let commentsToMerge = {},
    commentsToDelete = []
  try {
    const message = yield call(getMessageById, messageId)
    yield put(receiveMessages({ [messageId]: message }))
    commentsToMerge = yield call(getMessageComments, messageId)
    const commentsById = yield select(getCommentItemsById)
    commentsToDelete = R.pipe(
      R.filter(R.propEq('messageId', messageId)),
      R.keys,
    )(commentsById)

    const likes = yield call(getEntityLikes, messageId, ENTITIES.MESSAGE)
    yield call(removeUserEntityLikes, likes, messageId, ENTITIES.MESSAGE)

    yield put(receiveLikes(likes))
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to refresh the message', [{ text: 'OK' }])
  }
  yield put(
    receiveRefreshMessageComments({
      commentsToDelete,
      commentsToMerge,
      messageId,
    }),
  )
}

const requestRefreshMessageCommentsWatcher = function*() {
  yield takeLatest(
    REQUEST_REFRESH_MESSAGE_COMMENTS,
    requestRefreshMessageCommentsWorker,
  )
}

export default function*() {
  yield all([
    call(likeMessageWatcher),
    call(unlikeMessageWatcher),
    call(commentMessageWatcher),
    call(refreshMessagesWatcher),
    call(requestMessagesWatcher),
    call(uncommentMessageWatcher),
    call(requestMessageCommentsWatcher),
    call(requestRefreshMessageCommentsWatcher),
  ])
}
