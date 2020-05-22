import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'
import { Alert } from 'react-native'
import R from 'ramda'
import {
  EPISODE_LOADED,
  COMMENT_EPISODE,
  REQUEST_EPISODES,
  UNCOMMENT_EPISODE,
  REMOVE_LOCAL_EPISODE,
  REQUEST_LIKE_EPISODE,
  OPEN_EPISODE_CHANNEL,
  CLOSE_EPISODE_CHANNEL,
  REQUEST_UNLIKE_EPISODE,
  REQUEST_RESTORE_EPISODES,
  OPEN_EPISODE_COMMENTS_CHANNEL,
  CLOSE_EPISODE_COMMENTS_CHANNEL,
  receiveLikes,
  updateEpisode,
  receiveEpisodes,
  requestListeners,
  receiveListeners,
  receiveLikeEpisode,
  localCommentEpisode,
  receiveUnlikeEpisode,
  localUncommentEpisode,
  receiveRestoreEpisodes,
  requestEpisodeComments,
  receiveEpisodeComments,
} from '../actions'
import {
  likeEntity,
  unlikeEntity,
  getListeners,
  commentEntity,
  uncommentEntity,
  getCommentsByIds,
  getEpisodesBySoundcastId,
  getEpisodesByEpisodesList,
  checkIfLocalEpisodesExists,
} from '../managers'
import {
  addLoadedEpisode,
  getLoadedEpisodes,
  removeLoadedEpisode,
  replaceLoadedEpisodes,
} from '../repositories'
import { EPISODES_REQUEST_TYPE, EVENT_TYPES } from '../constants'
import {
  toPair,
  getUserLike,
  renameKeys,
  mutateEpisode,
  createLiveChannel,
  createAddCommentHandler,
  createEditCommentHandler,
  createRemoveCommentAction,
  createDynamicLiveChannel,
} from '../utils'
import firebase from 'react-native-firebase'
import {
  getUserFullName,
  getViewedEpisode,
  getSelectedEpisode,
  getCommentItemsAllId,
  getListenerItemsAllId,
} from '../selectors'
import moment from 'moment'

const requestEpisodesWorker = function*({ payload: { requestType, data } }) {
  try {
    const episodes =
      requestType === EPISODES_REQUEST_TYPE.BY_EPISODES_LIST
        ? yield call(getEpisodesByEpisodesList, data)
        : yield call(getEpisodesBySoundcastId, data)
    yield put(receiveEpisodes(episodes))
  } catch (error) {
    yield put(receiveEpisodes({}))
    Alert.alert('Error', 'Failed to load episodes', [{ text: 'OK' }])
  }
}

const requestEpisodesWatcher = function*() {
  yield takeLatest(REQUEST_EPISODES, requestEpisodesWorker)
}

const removeLocalEpisodeWorker = function*({ payload }) {
  yield call(removeLoadedEpisode, payload)
}

const removeLocalEpisodeWatcher = function*() {
  yield takeLatest(REMOVE_LOCAL_EPISODE, removeLocalEpisodeWorker)
}

const addLocalEpisodeWorker = function*({ payload }) {
  yield call(addLoadedEpisode, ...toPair(payload))
}

const addLocalEpisodeWatcher = function*() {
  yield takeLatest(EPISODE_LOADED, addLocalEpisodeWorker)
}

const likeEpisodeWorker = function*({ payload: { episodeId, soundcastId } }) {
  try {
    const userName = yield select(getUserFullName)
    const userId = firebase.auth().currentUser.uid
    const likeId = `${userId}-${episodeId}`
    const likeObject = {
      likeId,
      episodeId,
      soundcastId,
      timeStamp: moment().unix(),
      userId,
      fullName: userName,
    }
    yield all([
      call(likeEntity, likeObject),
      put(receiveLikeEpisode({ episodeId, userName })),
      put(receiveLikes({ [likeId]: likeObject })),
    ])
  } catch (error) {
    Alert.alert('Error', 'Failed to like the episode', [{ text: 'OK' }])
  }
}

const likeEpisodeWatcher = function*() {
  yield takeLatest(REQUEST_LIKE_EPISODE, likeEpisodeWorker)
}

const commentEpisodeWorker = function*({ payload }) {
  try {
    const commentObject = R.pipe(
      R.values,
      R.head,
      R.omit(['likesCount', 'userCreated', 'userLiked']),
      renameKeys({ creatorId: 'userId' }),
    )(payload)
    yield call(commentEntity, commentObject)
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to comment the episode', [{ text: 'OK' }])
  }
}

const commentEpisodeWatcher = function*() {
  yield takeLatest(COMMENT_EPISODE, commentEpisodeWorker)
}

const uncommentEpisodeWorker = function*({ payload: { commentId } }) {
  try {
    yield call(uncommentEntity, commentId)
  } catch (error) {
    Alert.alert('Error', 'Failed to delete the comment', [{ text: 'OK' }])
  }
}

const uncommentEpisodeWatcher = function*() {
  yield takeLatest(UNCOMMENT_EPISODE, uncommentEpisodeWorker)
}

const unlikeEpisodeWorker = function*({ payload: episodeId }) {
  try {
    const uid = firebase.auth().currentUser.uid
    const likeId = `${uid}-${episodeId}`
    let lastLikedName = yield call(unlikeEntity, likeId)
    if (!lastLikedName) {
      lastLikedName = 'Guest'
    }
    yield put(
      receiveUnlikeEpisode({
        [likeId]: {
          episodeId,
          userName: lastLikedName,
        },
      }),
    )
  } catch (error) {
    Alert.alert('Error', 'Failed to unlike the episode', [{ text: 'OK' }])
  }
}

const unlikeEpisodeWatcher = function*() {
  yield takeLatest(REQUEST_UNLIKE_EPISODE, unlikeEpisodeWorker)
}

const restoreEpisodesWorker = function*() {
  let episodesFromStorage = yield call(getLoadedEpisodes)
  if (!R.isEmpty(episodesFromStorage)) {
    const checkedEpisodes = yield call(
      checkIfLocalEpisodesExists,
      episodesFromStorage,
    )
    const episodes = R.pick(checkedEpisodes, episodesFromStorage)
    if (!R.equals(episodes, episodesFromStorage))
      yield call(replaceLoadedEpisodes, episodes)

    episodesFromStorage = episodes
  }
  yield put(receiveRestoreEpisodes(episodesFromStorage))
}

const restoreEpisodesWatcher = function*() {
  yield takeLatest(REQUEST_RESTORE_EPISODES, restoreEpisodesWorker)
}

const addCommentHandler = createAddCommentHandler(localCommentEpisode)

const editCommentHandler = createEditCommentHandler()

const removeCommentHandler = createRemoveCommentAction(localUncommentEpisode)

const selectHandler = R.cond([
  [R.equals(EVENT_TYPES.CHILD_ADDED), R.always(addCommentHandler)],
  [R.equals(EVENT_TYPES.CHILD_REMOVED), R.always(removeCommentHandler)],
  [R.T, R.always(editCommentHandler)],
])

const onInitComments = function*() {
  const allCommentsIds = yield select(getCommentItemsAllId)
  const { comments: selectedEntityComments, episodeId } = yield select(
    getSelectedEpisode,
  )
  const neededComments = R.difference(selectedEntityComments, allCommentsIds)
  try {
    if (neededComments.length) {
      yield put(requestEpisodeComments(episodeId))
      const comments = yield call(getCommentsByIds, neededComments)
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
      }
      yield put(receiveEpisodeComments({ comments, episodeId }))
    }
  } catch (error) {
    yield put(receiveEpisodeComments({ episodeId }))
  }
}

const channelConfig = eventType => ({
  openChannelAction: OPEN_EPISODE_COMMENTS_CHANNEL,
  closeChannelAction: CLOSE_EPISODE_COMMENTS_CHANNEL,
  eventType,
  handler: selectHandler(eventType),
  entitySelector: getViewedEpisode,
  onInitChannel: eventType === EVENT_TYPES.CHILD_ADDED && onInitComments,
  firebasePaths: { beforeEntity: 'episodes', afterEntity: 'comments' },
})

const episodeHandler = function*(snapshot, episodeId) {
  if (snapshot.exists()) {
    try {
      const episodeData = mutateEpisode(snapshot.val())
      const { likeId, like } = yield call(
        getUserLike,
        firebase.auth().currentUser.uid,
        episodeId,
      )
      // if (episodeId === '1540695865700e') {
      //   console.log('1540695865700e episodeData = ', episodeData)
      //   console.log('likeId,like = ', likeId, like)
      // }
      yield put(
        updateEpisode({
          episode: { [episodeId]: episodeData },
          likeId,
          like,
        }),
      )
    } catch (error) {
      Alert.alert('Error', 'Failed to update the episode', [{ text: 'OK' }])
    }
  }
}

// TODO: add checking for opened episode
const episodeLiveChannelWorker = function*({ payload: episodeId }) {
  const channelEpisodeConfig = {
    closeChannelAction: CLOSE_EPISODE_CHANNEL,
    eventType: EVENT_TYPES.VALUE,
    handler: episodeHandler,
    pathToListen: `episodes/${episodeId}`,
    entity: episodeId,
    // skipFirstRound: true,
    skipFirstRound: false,
  }
  yield call(createDynamicLiveChannel, channelEpisodeConfig)
}

const episodeLiveChannelWatcher = function*() {
  yield takeEvery(OPEN_EPISODE_CHANNEL, episodeLiveChannelWorker)
}

export default function*() {
  yield all([
    call(requestEpisodesWatcher),
    call(removeLocalEpisodeWatcher),
    call(addLocalEpisodeWatcher),
    call(restoreEpisodesWatcher),
    call(likeEpisodeWatcher),
    call(unlikeEpisodeWatcher),
    call(commentEpisodeWatcher),
    call(uncommentEpisodeWatcher),
    call(createLiveChannel, channelConfig(EVENT_TYPES.CHILD_ADDED)),
    call(createLiveChannel, channelConfig(EVENT_TYPES.CHILD_REMOVED)),
    call(createLiveChannel, channelConfig(EVENT_TYPES.CHILD_CHANGED)),
    call(episodeLiveChannelWatcher),
  ])
}
