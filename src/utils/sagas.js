import R from 'ramda'
import { call, select, put } from 'redux-saga/effects'
import {
  getLikeById,
  getListeners,
  getCommentById,
  getEntityComments,
  getEntityLikes,
} from '../managers'
import {
  getCurrentTrackPosition,
  getListenerItemsAllId,
  getCommentItemsById,
  getPlayerSpeedRate,
  getUserLikes,
} from '../selectors'
import {
  requestListeners,
  receiveListeners,
  updateComment,
  receiveLikes,
  removeLikes,
} from '../actions'
import { isExists } from './logic'
import firebase from 'react-native-firebase'
import MusicControl from 'react-native-music-control'
import { ENTITIES } from '../constants'

export const createAddCommentHandler = commentAction =>
  function*(snapshot) {
    const commentId = snapshot.key
    console.log("createAddCommendHandler: ", snapshot)
    const storeComments = yield select(getCommentItemsById)
    if (!storeComments[commentId]) {
      let comment = yield call(getCommentById, commentId)
      const listeners = yield select(getListenerItemsAllId)
      if (
        isExists(comment.creatorId) &&
        !R.contains(comment.creatorId, listeners)
      ) {
        yield put(requestListeners())
        const listener = yield call(getListeners, [comment.creatorId])
        yield put(receiveListeners(listener))
      }
      yield put(commentAction({ [commentId]: comment }))
    }
  }

export const createEditCommentHandler = () =>
  function*(snapshot) {
    const commentId = snapshot.key
    const comment = yield call(getCommentById, commentId)
    const { like, likeId } = yield call(
      getUserLike,
      firebase.auth().currentUser.uid,
      commentId,
    )
    yield put(
      updateComment({
        comment: { [commentId]: comment },
        likeId,
        like,
      }),
    )
  }

export const createRemoveCommentAction = uncommentAction =>
  function*(snapshot, entityId) {
    yield put(uncommentAction({ entityId, commentId: snapshot.key }))
  }

export const getUserLike = function*(userId, entityId) {
  const likeId = `${userId}-${entityId}`
  const like = yield call(getLikeById, likeId)
  return { like, likeId }
}

export const getMessageComments = function*(messageId) {
  const comments = yield call(getEntityComments, messageId, ENTITIES.MESSAGE)
  if (!R.isEmpty(comments)) {
    const allListenersIds = yield select(getListenerItemsAllId)
    const commentsCreators = R.pipe(
      R.map(R.prop('creatorId')),
      R.values,
      R.difference(R.__, allListenersIds),
    )(comments)
    if (commentsCreators.length) {
      yield put(requestListeners())
      const listeners = yield call(getListeners, commentsCreators)
      yield put(receiveListeners(listeners))
    }
    const likes = yield call(getEntityLikes, messageId, ENTITIES.MESSAGE)
    yield put(receiveLikes(likes))
  }
  return comments
}

// remove likes if the same user unliked from other source
export const removeUserEntityLikes = function*(likes, entityId, entityType) {
  let localUserLikes = yield select(getUserLikes)
  localUserLikes = R.pipe(
    R.clone,
    R.filter(
      R.where({
        [entityType === ENTITIES.MESSAGE ? 'messageId' : 'episodeId']: R.is(
          Array,
          entityId,
        )
          ? R.contains(R.__, entityId)
          : R.equals(entityId),
      }),
    ),
    R.map(R.prop('likeId')),
  )(localUserLikes)

  const userId = firebase.auth().currentUser.uid
  const remoteUserLikes = R.pipe(
    R.filter(R.propEq('userId', userId)),
    R.keys,
  )(likes)

  const diffLikes = R.difference(localUserLikes, remoteUserLikes)
  if (diffLikes.length) {
    yield put(removeLikes(diffLikes))
  }
}

export const setBackgroundPlayer = function*(
  track,
  musicControlState = MusicControl.STATE_PLAYING,
) {
  let duration = isNaN(track.duration) ? 0 : track.duration
  if (typeof duration === 'string') {
    duration = Number(duration)
    if (isNaN(duration)) duration = 0
  }
  const config = {
    title: track.title,
    artist: track.artist,
    album: track.albumTitle,
    artwork: track.trackImageUrl,
    genre: '',
    duration,
    description: '',
    color: 0xffffff,
  }

  const trackPosition = yield select(getCurrentTrackPosition)
  const elapsedTime = trackPosition ? trackPosition.playPosition : 0
  const speedRate = yield select(getPlayerSpeedRate)
  MusicControl.setNowPlaying(config)
  MusicControl.updatePlayback({
    state: musicControlState,
    speed: speedRate,
    elapsedTime,
  })
}
