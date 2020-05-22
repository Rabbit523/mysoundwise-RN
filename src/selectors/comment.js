import R from 'ramda'
import { getViewedEpisode } from './episode'
import { getListenersWithoutGuests } from './listener'
import { getViewedMessage } from './message'
import { checkLikeExists, createRefMemoizer, memoizeLastWith } from '../utils'
import { getLikeItemsById } from './like'
import { getUid } from './user'

export const getCommentState = R.prop('comment')

export const getCommentItemsById = R.pipe(
  getCommentState,
  R.prop('byId'),
)

export const getCommentItemsAllId = R.pipe(
  getCommentState,
  R.prop('allId'),
)

const sortComments = R.sort(
  R.ascend(
    R.pipe(
      R.values,
      R.head,
    ),
  ),
)
const sortedArray = R.pipe(
  sortComments,
  R.mergeAll,
  R.keys,
)
const processComments = (comments, listeners, allLikes, userId) => {
  let parents = [],
    children = []
  for (let commentId in comments) {
    let comment = comments[commentId]
    const parentId = comment.parentId
    if (R.isNil(parentId)) {
      parents.push({ [commentId]: comment.timestamp })
    } else {
      if (!R.isNil(children[parentId])) {
        children[parentId].push({ [commentId]: comment.timestamp })
      } else {
        children[parentId] = [{ [commentId]: comment.timestamp }]
      }
    }
  }
  parents = sortedArray(parents)
  for (let commentId in children) {
    children[commentId] = sortedArray(children[commentId])
  }
  const newComments = []
  for (let parentId of parents) {
    newComments.push(comments[parentId])
    for (let childrenId in children[parentId]) {
      newComments.push(comments[children[parentId][childrenId]])
    }
  }
  // TODO: merge map with upper cycles ^^^^
  return R.map(
    comment => ({
      userLiked: checkLikeExists(allLikes, userId, comment.commentId),
      ...R.pick(
        ['firstName', 'lastName', 'picUrl'],
        listeners[comment.creatorId] || { firstName: 'John', lastName: 'Doe' },
      ),
      ...comment,
    }),
    newComments,
  )
}

export const getEpisodeComments = R.converge(
  (episodeId, commentsById) =>
    R.filter(R.propEq('episodeId', episodeId), commentsById),
  [getViewedEpisode, getCommentItemsById],
)

export const getEpisodeCommentsList = R.converge(
  memoizeLastWith(createRefMemoizer(true, true), processComments),
  [getEpisodeComments, getListenersWithoutGuests, getLikeItemsById, getUid],
)

export const getMessageComments = R.converge(
  (messageId, commentsById) =>
    R.filter(R.propEq('messageId', messageId), commentsById),
  [getViewedMessage, getCommentItemsById],
)

export const getMessageCommentsList = R.converge(
  memoizeLastWith(createRefMemoizer(true, true), processComments),
  [getMessageComments, getListenersWithoutGuests, getLikeItemsById, getUid],
)
