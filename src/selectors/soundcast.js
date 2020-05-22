import R from 'ramda'
import { getUserSubscriptions } from './user'
import {
  isExists,
  memoizeLastWith,
  createRefMemoizer,
  mutateSoundcastSelector,
} from '../utils'
import { getPublishersById } from './publisher'

export const getSoundcastState = R.prop('soundcast')

export const getSoundcastItems = R.pipe(
  getSoundcastState,
  R.prop('items'),
)

export const getViewedSoundcast = R.pipe(
  getSoundcastState,
  R.prop('viewedSoundcast'),
)

export const getViewedExploreSoundcast = R.pipe(
  getSoundcastState,
  R.prop('viewedExploreSoundcast'),
)

export const getViewedBundleSoundcast = R.pipe(
  getSoundcastState,
  R.prop('viewedBundleSoundcast'),
)

export const getIsFetchingExploreSoundcast = R.pipe(
  getSoundcastState,
  R.prop('isFetchingExploreSoundcast'),
)

export const getSoundcastsById = R.pipe(
  getSoundcastItems,
  R.prop('byId'),
)

export const getSoundcastsAllId = R.pipe(
  getSoundcastItems,
  R.prop('allId'),
)

export const getUpdatedSoundcasts = R.pipe(
  getSoundcastItems,
  R.prop('updated'),
)

export const getUserSoundcasts = R.converge(
  memoizeLastWith(createRefMemoizer(true, true), (soundcasts, subscriptions) =>
    R.pipe(
      R.pick(R.keys(subscriptions)),
      R.values,
      R.sortBy(R.prop('title')),
    )(soundcasts),
  ),
  [getSoundcastsById, getUserSubscriptions],
)

export const getNotUserSoundcasts = R.converge(
  memoizeLastWith(createRefMemoizer(true, true), (soundcasts, subscriptions) =>
    R.pipe(
      R.omit(R.keys(subscriptions)),
      R.values,
      R.sortBy(R.prop('title')),
    )(soundcasts),
  ),
  [getSoundcastsById, getUserSubscriptions],
)

export const getSelectedSoundcast = R.converge(R.prop, [
  getViewedSoundcast,
  getSoundcastsById,
])

export const getMutatedSelectedSoundcast = R.pipe(
  getSelectedSoundcast,
  mutateSoundcastSelector,
)

export const getSelectedSoundcastImage = R.pipe(
  getSelectedSoundcast,
  R.prop('imageUrl'),
)

export const getSelectedSoundcastPublisherName = R.converge(
  (soundcast, publishers) =>
    R.propOr('name', 'John Doe', publishers[soundcast.publisherId]),
  [getSelectedSoundcast, getPublishersById],
)

export const getSelectedSoundcastTitle = R.pipe(
  getSelectedSoundcast,
  R.prop('title'),
)

export const getExploreSoundcastInfo = R.converge(R.prop, [
  getViewedExploreSoundcast,
  getSoundcastsById,
])

export const getExploreBundleSoundcastInfo = R.converge(R.prop, [
  getViewedBundleSoundcast,
  getSoundcastsById,
])

export const getBundleSoundcasts = R.converge(
  (bundleSoundcasts, soundcasts) =>
    isExists(bundleSoundcasts) ? R.props(bundleSoundcasts, soundcasts) : [],
  [
    R.pipe(
      getExploreSoundcastInfo,
      R.prop('soundcastsIncluded'),
    ),
    getSoundcastsById,
  ],
)
