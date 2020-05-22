import R from 'ramda'
import { memoizeLastWith, createRefMemoizer } from '../utils'

export const getListenerState = R.prop('listener')

export const getListenerItems = R.pipe(getListenerState, R.prop('items'))

export const getListenerItemsById = R.pipe(getListenerItems, R.prop('byId'))

export const getListenerItemsAllId = R.pipe(getListenerItems, R.prop('allId'))

export const getListenersWithoutGuestsIds = R.pipe(
  getListenerItemsAllId,
  memoizeLastWith(
    createRefMemoizer(true, true),
    R.filter(R.complement(R.startsWith('web-'))),
  ),
)

export const getListenersWithoutGuests = R.converge(
  memoizeLastWith(createRefMemoizer(true, true), R.pick),
  [getListenersWithoutGuestsIds, getListenerItemsById],
)
