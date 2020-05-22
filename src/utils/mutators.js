import R from 'ramda'
import { renameKeys } from './objects'
import { parseStringForBolds } from './strings'
import { isExists } from './logic'
import firebase from 'react-native-firebase'
import moment from 'moment'

// episodes = {$id: true}
const episodeMap = {
  soundcastID: 'soundcastId',
  publisherID: 'publisherId',
  creatorID: 'creatorId',
}

export const mutateEpisode = episode => {
  const newEpisode = renameKeys(episodeMap, episode)
  if (R.isNil(newEpisode.likesCount)) {
    newEpisode.likesCount = 0
  }
  if (R.isNil(newEpisode.comments)) {
    newEpisode.comments = []
  } else {
    newEpisode.comments = R.keys(newEpisode.comments)
  }
  if (R.isNil(newEpisode.lastLiked)) {
    newEpisode.lastLiked = ''
  } else if (R.isEmpty(newEpisode.lastLiked)) {
    newEpisode.lastLiked = 'Guest'
  }
  newEpisode.isLikeFetching = false
  newEpisode.isLoaded = false
  return newEpisode
}

const messageMap = {
  announcementId: 'messageId',
}

export const mutateMessage = message => {
  const newMessage = renameKeys(messageMap, message)
  newMessage.isLikeFetching = false
  newMessage.content = newMessage.content.replace(
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/g,
    '<a href="$&">$&</a>',
  )
  if (isExists(newMessage.createdAt)) {
    newMessage.timeStamp = moment(newMessage.createdAt).unix()
  }

  return newMessage
}

export const checkLikeExists = (allLikes, userId, entityId) =>
  !R.isNil(allLikes[`${userId}-${entityId}`])

export const mutateEpisodeSelector = (
  episode,
  loadedEpisodes,
  allLikes,
  userId,
) => {
  const mergeObject = {}
  mergeObject.userLiked = checkLikeExists(allLikes, userId, episode.episodeId)
  if (loadedEpisodes[episode.episodeId]) {
    mergeObject.isLoaded = true
    mergeObject.localPath = loadedEpisodes[episode.episodeId]
  }
  mergeObject.commentsCount = episode.comments.length
  return R.merge(episode, mergeObject)
}

export const mutateMessageSelector = (message, allLikes, userId) => {
  const mergeObject = {}
  mergeObject.userLiked = checkLikeExists(allLikes, userId, message.messageId)
  return R.merge(message, mergeObject)
}

export const processLikesList = (likes, listeners) =>
  R.pipe(
    R.map(like => ({
      ...R.pick(
        ['firstName', 'lastName', 'picUrl'],
        listeners[like.userId] || { firstName: 'John', lastName: 'Doe' },
      ),
      ...like,
    })),
    R.values,
  )(likes)

const updateMap = {
  avatarUrl: 'imageUrl',
  id: 'eventId',
  story: 'content',
}

export const mutateUpdate = update => {
  const newUpdate = renameKeys(updateMap, update)
  newUpdate.content = parseStringForBolds(update.story)
  return newUpdate
}

const soundcastMap = {
  imageURL: 'imageUrl',
  creatorID: 'creatorId',
  publisherID: 'publisherId',
  hostImageURL: 'hostImageUrl',
  blurredImageURL: 'blurredImageUrl',
  long_description: 'longDescription',
  short_description: 'shortDescription',
}

export const mutateSoundcast = soundcast => {
  const newSoundcast = renameKeys(soundcastMap, soundcast)
  if (isExists(newSoundcast.longDescription)) {
    newSoundcast.longDescription = JSON.parse(newSoundcast.longDescription)
  }
  return newSoundcast
}

const notFalse = val => val !== false
export const mutateSoundcastSelector = soundcast => {
  if (soundcast.subscribed) {
    soundcast.subscribersCount = R.pipe(
      R.filter(notFalse),
      R.keys,
      R.length,
    )(soundcast.subscribed)
  }

  return soundcast
}

export const processExploreEpisodes = (selectedSoundcast, episodesById) =>
  R.pipe(
    R.filter(R.propEq('soundcastId', selectedSoundcast)),
    R.sort(R.descend(R.prop('index'))),
  )(R.values(episodesById))

const commentMap = {
  announcementId: 'messageId',
  userId: 'creatorId',
}

export const mutateComment = comment => {
  const newComment = renameKeys(commentMap, comment)
  if (R.isNil(newComment.likesCount)) {
    newComment.likesCount = 0
  }
  return {
    userCreated: firebase.auth().currentUser.uid === newComment.creatorId,
    ...newComment,
  }
}

const userInfoMap = {
  pic_url: 'picUrl',
  publisherID: 'publisherId',
}

export const mutateUser = user => {
  const newUser = renameKeys(userInfoMap, user)
  if (newUser.soundcasts) {
    newUser.soundcasts = R.filter(
      R.propEq('subscribed', true),
      newUser.soundcasts,
    )
  }
  return newUser
}
