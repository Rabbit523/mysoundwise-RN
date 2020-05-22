import R from 'ramda'
import { ENTITIES } from '../constants'
import { params, mutateComment } from '../utils'
import axios from 'axios'
import API from '../api'

export const getEntityComments = (entityId, entityType) => {
  const axiosParams = params()
    .startParam('filter')
    .startParam('where')
  if (entityType === ENTITIES.EPISODE) {
    axiosParams.addProp('episodeId', entityId)
  } else if (entityType === ENTITIES.MESSAGE) {
    axiosParams.addProp('announcementId', entityId)
  } else {
    return {}
  }

  return axios
    .get(API.COMMENTS, { params: axiosParams.end() })
    .then(
      R.pipe(
        R.prop('data'),
        R.map(mutateComment),
        R.indexBy(R.prop('commentId')),
      ),
    )
    .catch(R.always({}))
}

export const getCommentsByIds = commentIds => {
  const axiosParams = params()
    .startParam('filter')
    .startParam('where')
    .addProp('commentId', { inq: commentIds })

  return axios
    .get(API.COMMENTS, { params: axiosParams.end() })
    .then(
      R.pipe(
        R.prop('data'),
        R.map(mutateComment),
        R.indexBy(R.prop('commentId')),
      ),
    )
    .catch(R.always({}))
}

export const getCommentById = commentId =>
  axios
    .get(API.COMMENT_BY_ID(commentId))
    .then(
      R.pipe(
        R.prop('data'),
        mutateComment,
      ),
    )
    .catch(R.always({}))

export const commentEntity = commentObject =>
  axios.post(API.COMMENTS, R.evolve({ content: R.trim }, commentObject))

export const editComment = (commentId, data) =>
  axios.patch(API.COMMENT_BY_ID(commentId), data)

export const uncommentEntity = commentId =>
  axios.delete(API.COMMENT_BY_ID(commentId))
