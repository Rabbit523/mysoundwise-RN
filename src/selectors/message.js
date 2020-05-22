import R from 'ramda'
import { getSoundcastsById } from './soundcast'
import { getListenersWithoutGuests } from './listener'
import { mutateMessageSelector, processLikesList, isExists } from '../utils'
import { getLikeItemsById, getLikesWithoutGuestsIds } from './like'
import { getUid } from './user'

export const getMessageState = R.prop('message')

export const getMessageFetching = R.pipe(
  getMessageState,
  R.prop('fetching'),
)

export const getIsFetchingMessages = R.pipe(
  getMessageFetching,
  R.prop('isFetchingMessages'),
)

export const getIsRefreshingMessages = R.pipe(
  getMessageFetching,
  R.prop('isRefreshingMessages'),
)

export const getIsRefreshingMessageComments = R.pipe(
  getMessageFetching,
  R.prop('isRefreshingMessageComments'),
)

export const getIsFetchingMessageComments = R.pipe(
  getMessageFetching,
  R.prop('isFetchingMessageComments'),
)

export const getMessageItems = R.pipe(
  getMessageState,
  R.prop('items'),
)

export const getMessagesById = R.pipe(
  getMessageItems,
  R.prop('byId'),
)

export const getMessagesAllId = R.pipe(
  getMessageItems,
  R.prop('allId'),
)

export const getViewedSubscription = R.pipe(
  getMessageState,
  R.prop('viewedSubscription'),
)

export const getViewedMessage = R.pipe(
  getMessageState,
  R.prop('viewedMessage'),
)

export const getIsRefreshingSelectedMessageComments = R.converge(R.prop, [
  getViewedMessage,
  getIsRefreshingMessageComments,
])

export const getSelectedMessage = R.converge(R.prop, [
  getViewedMessage,
  getMessagesById,
])

export const getSelectedMessageLikesCount = R.pipe(
  getSelectedMessage,
  R.prop('likesCount'),
)

export const getIsViewedMessageCommentsFetching = R.converge(R.prop, [
  getViewedMessage,
  getIsFetchingMessageComments,
])

export const getSelectedSubscription = R.converge(R.prop, [
  getViewedSubscription,
  getSoundcastsById,
])

export const getMutatedSelectedMessage = R.converge(mutateMessageSelector, [
  getSelectedMessage,
  getLikeItemsById,
  getUid,
])

export const getMessageLikesKeys = R.converge(
  (messageId, allIds) => R.filter(R.contains(messageId), allIds),
  [getViewedMessage, getLikesWithoutGuestsIds],
)

export const getMessageLikes = R.converge(R.pick, [
  getMessageLikesKeys,
  getLikeItemsById,
])

export const getMessageLikesList = R.converge(processLikesList, [
  getMessageLikes,
  getListenersWithoutGuests,
])

export const getMessagesByCurrentSubscription = R.converge(
  (messages, soundcastId, listeners, allLikes, userId) =>
    !isExists(messages) || !isExists(soundcastId)
      ? []
      : R.pipe(
          R.filter(R.propEq('soundcastId', soundcastId)),
          R.map(message => ({
            ...R.pick(
              ['picUrl', 'firstName', 'lastName'],
              listeners[message.creatorId] || {
                firstName: 'John',
                lastName: 'Doe',
              },
            ),
            ...mutateMessageSelector(message, allLikes, userId),
          })),
          R.values,
          R.sort(R.descend(R.prop('timestamp'))),
        )(messages),
  [
    getMessagesById,
    getViewedSubscription,
    getListenersWithoutGuests,
    getLikeItemsById,
    getUid,
  ],
)
