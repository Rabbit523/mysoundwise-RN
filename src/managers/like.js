import R from 'ramda'
import { ENTITIES } from '../constants'
import API from '../api'
import axios from 'axios'
import { params } from '../utils'

const getLikes = axiosParams =>
  axios.get(API.LIKES, { params: axiosParams }).then(
    R.pipe(
      R.prop('data'),
      R.indexBy(R.prop('likeId')),
    ),
  )

// only for episodes and messages!
export const getEntityLikes = (entityId, entityType) => {
  const axiosParams = params()
    .startParam('filter')
    .startParam('where')
  if (entityType === ENTITIES.EPISODE) {
    axiosParams.addProp('episodeId', entityId)
  } else if (entityType === ENTITIES.MESSAGE) {
    axiosParams.addProp('messageId', entityId)
  } else {
    return {}
  }

  return getLikes(axiosParams.end())
}

export const getCommentsLikes = commentIds => {
  const axiosParams = params()
    .startParam('filter')
    .startParam('where')
    .addProp('commentId', R.is(Array) ? { inq: commentIds } : commentIds)

  return getLikes(axiosParams.end())
}

export const getLikesByUserId = userId => {
  const axiosParams = params()
    .startParam('filter')
    .startParam('where')
    .addProp('userId', userId)

  return getLikes(axiosParams.end())
}

export const getLikesByMessageIds = messageIds => {
  const axiosParams = params()
    .startParam('filter')
    .startParam('where')
    .addProp('announcementId', R.is(Array) ? { inq: messageIds } : messageIds)
  return getLikes(axiosParams.end())
}

export const getLikeById = likeId =>
  axios
    .get(API.LIKE_BY_ID(likeId))
    .then(R.prop('data'))
    .catch(R.always(null))

export const likeEntity = likeObject => axios.post(API.LIKES, likeObject)

export const unlikeEntity = likeId =>
  axios
    .delete(API.LIKE_BY_ID(likeId))
    .then(R.path(['data', 'lastLiked']))
    .catch(R.always('Guest'))
