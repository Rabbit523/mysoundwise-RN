import R from 'ramda'
import { all, call, select, takeLatest } from 'redux-saga/effects'
import { Alert } from 'react-native'
import { EDIT_COMMENT, LIKE_COMMENT, UNLIKE_COMMENT } from '../actions'
import { editComment, likeEntity, unlikeEntity } from '../managers'
import { getUserFullName } from '../selectors'
import { renameKeys } from '../utils'

const editCommentWorker = function*({ payload: { commentId, ...rest } }) {
  try {
    yield call(editComment, commentId, R.omit(['entityId', 'entityType'], rest))
  } catch (error) {
    Alert.alert('Error', 'Failed to edit the comment', [{ text: 'OK' }])
  }
}

const editCommentWatcher = function*() {
  yield takeLatest(EDIT_COMMENT, editCommentWorker)
}

const likeCommentWorker = function*({ payload: likeObject }) {
  const fullName = yield select(getUserFullName)
  try {
    yield call(likeEntity, {
      ...renameKeys({ messageId: 'announcementId' }, likeObject),
      fullName,
    })
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to like the comment', [{ text: 'OK' }])
  }
}

const likeCommentWatcher = function*() {
  yield takeLatest(LIKE_COMMENT, likeCommentWorker)
}

const unlikeCommentWorker = function*({ payload: { likeId } }) {
  try {
    yield call(unlikeEntity, likeId)
  } catch (error) {
    Alert.alert('Error', 'Failed to unlike the comment', [{ text: 'OK' }])
  }
}

const unlikeCommentWatcher = function*() {
  yield takeLatest(UNLIKE_COMMENT, unlikeCommentWorker)
}

export default function*() {
  yield all([
    call(editCommentWatcher),
    call(likeCommentWatcher),
    call(unlikeCommentWatcher),
  ])
}
