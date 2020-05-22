import R from 'ramda'
import { memoizeLastWith, createRefMemoizer } from '../utils'

export const getUpdatesState = R.prop('update')

export const getIsUpdatesFetching = R.pipe(
  getUpdatesState,
  R.prop('isFetching'),
)

export const getUpdatesItems = R.pipe(getUpdatesState, R.prop('items'))

export const getUpdatesItemsById = R.pipe(getUpdatesItems, R.prop('byId'))

export const getUpdatesItemsAllId = R.pipe(getUpdatesItems, R.prop('allId'))

export const getUpdatesPagination = R.pipe(
  getUpdatesState,
  R.prop('pagination'),
)

export const getIsPreparingTransition = R.pipe(
  getUpdatesState,
  R.prop('isPreparing'),
)

export const getUpdatesPage = R.pipe(getUpdatesPagination, R.prop('page'))

export const getIsUpdatesPagesEnded = R.pipe(
  getUpdatesPagination,
  R.prop('isPagesEnded'),
)

export const getIsUpdatesRefreshing = R.pipe(
  getUpdatesPagination,
  R.prop('isRefreshing'),
)

export const getSortedUpdates = R.pipe(
  getUpdatesItemsById,
  memoizeLastWith(createRefMemoizer(true, true), R.values),
  memoizeLastWith(
    createRefMemoizer(true, true),
    R.sort(R.descend(R.prop('timestamp'))),
  ),
)
