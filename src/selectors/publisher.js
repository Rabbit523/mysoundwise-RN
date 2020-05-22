import R from 'ramda'

export const getPublisherState = R.prop('publisher')

export const getIsFetchingPublishers = R.pipe(
  getPublisherState,
  R.prop('isFetching'),
)

export const getPublisherItems = R.pipe(getPublisherState, R.prop('items'))

export const getPublishersById = R.pipe(getPublisherItems, R.prop('byId'))

export const getPublishersAllId = R.pipe(getPublisherItems, R.prop('allId'))
