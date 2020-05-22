import R from 'ramda'

import { getUid } from './user'

export const getLikeState = R.prop('like')

export const getLikeItems = R.pipe(getLikeState, R.prop('items'))

export const getLikeItemsById = R.pipe(getLikeItems, R.prop('byId'))

export const getLikeItemsAllId = R.pipe(getLikeItems, R.prop('allId'))

export const getIsLikesFetching = R.pipe(getLikeState, R.prop('isFetching'))

export const getLikesWithoutGuestsIds = R.pipe(
  getLikeItemsAllId,
  R.filter(R.complement(R.startsWith('web-'))),
)

export const getUserLikes = R.converge(
  (uid, likes) => R.pipe(R.pickBy(R.propEq('userId', uid)), R.values)(likes),
  [getUid, getLikeItemsById],
)
