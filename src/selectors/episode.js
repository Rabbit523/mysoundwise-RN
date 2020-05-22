import R from 'ramda'
import { getListenersWithoutGuests } from './listener'
import {
  getViewedSoundcast,
  getViewedBundleSoundcast,
  getViewedExploreSoundcast,
  getSelectedSoundcastTitle,
  getSelectedSoundcastPublisherName,
} from './soundcast'
import { getLikeItemsById, getLikesWithoutGuestsIds } from './like'
import { getUid } from './user'
import {
  memoizeLastWith,
  checkLikeExists,
  processLikesList,
  createRefMemoizer,
  mutateEpisodeSelector,
  processExploreEpisodes,
} from '../utils'

export const getEpisodeState = R.prop('episode')

export const getEpisodeFetching = R.pipe(
  getEpisodeState,
  R.prop('fetching'),
)

export const getIsFetchingEpisodes = R.pipe(
  getEpisodeFetching,
  R.prop('isFetchingEpisodes'),
)

export const getIsFetchingEpisodeComments = R.pipe(
  getEpisodeFetching,
  R.prop('isFetchingEpisodeComments'),
)

export const getEpisodeItems = R.pipe(
  getEpisodeState,
  R.prop('items'),
)

export const getViewedEpisode = R.pipe(
  getEpisodeState,
  R.prop('viewedEpisode'),
)

export const getLocalItems = R.pipe(
  getEpisodeState,
  R.prop('localItems'),
)

export const getDownloadTasks = R.pipe(
  getEpisodeState,
  R.prop('downloadTasks'),
)

export const getEpisodesAllId = R.pipe(
  getEpisodeItems,
  R.prop('allId'),
)

export const getEpisodesById = R.pipe(
  getEpisodeItems,
  R.prop('byId'),
)

export const getIsViewedEpisodeCommentsFetching = R.converge(R.prop, [
  getViewedEpisode,
  getIsFetchingEpisodeComments,
])

export const getPublishedEpisodes = R.pipe(
  getEpisodesById,
  R.filter(R.propEq('isPublished', true)),
)

export const getEpisodes = R.converge(
  memoizeLastWith(
    createRefMemoizer(true, true),
    (selectedSoundcast, episodesById, localEpisodes, allLikes, userId) =>
      R.pipe(
        R.values,
        R.filter(R.propEq('soundcastId', selectedSoundcast)),
        R.map(episode =>
          mutateEpisodeSelector(episode, localEpisodes, allLikes, userId),
        ),
      )(episodesById),
  ),
  [
    getViewedSoundcast,
    getPublishedEpisodes,
    getLocalItems,
    getLikeItemsById,
    getUid,
  ],
)

export const getSortedEpisodesDesc = R.pipe(
  getEpisodes,
  R.sort(R.descend(R.prop('index'))),
)

export const getPlayerEpisodes = R.converge(
  memoizeLastWith(
    createRefMemoizer(true, true),
    (episodes, soundcastTitle, publisherName) =>
      R.pipe(
        R.map(episode => ({ ...episode, publisherName, soundcastTitle })),
        R.sortBy(R.prop('index')),
      )(episodes),
  ),
  [getEpisodes, getSelectedSoundcastTitle, getSelectedSoundcastPublisherName],
)

export const getSelectedEpisode = R.converge(R.prop, [
  getViewedEpisode,
  getPublishedEpisodes,
])

export const getSelectedEpisodeLikesCount = R.pipe(
  getSelectedEpisode,
  R.prop('likesCount'),
)

export const getMutatedSelectedEpisode = R.converge(
  memoizeLastWith(createRefMemoizer(true, true), mutateEpisodeSelector),
  [getSelectedEpisode, getLocalItems, getLikeItemsById, getUid], // TODO: getListenersWithoutGuests return new ref? fix it
)

export const getIsUserLikedSelectedEpisode = R.converge(checkLikeExists, [
  getLikeItemsById,
  getUid,
  getViewedEpisode,
])

export const getEpisodeLikesKeys = R.converge(
  (episodeId, allIds) => R.filter(R.contains(episodeId), allIds),
  [getViewedEpisode, getLikesWithoutGuestsIds],
)

export const getEpisodeLikes = R.converge(R.pick, [
  getEpisodeLikesKeys,
  getLikeItemsById,
])

export const getEpisodeLikesList = R.converge(processLikesList, [
  getEpisodeLikes,
  getListenersWithoutGuests,
])

export const getExploreEpisodes = R.converge(
  memoizeLastWith(createRefMemoizer(true, true), processExploreEpisodes),
  [getViewedExploreSoundcast, getPublishedEpisodes],
)

export const getBundleExploreEpisodes = R.converge(
  memoizeLastWith(createRefMemoizer(true, true), processExploreEpisodes),
  [getViewedBundleSoundcast, getPublishedEpisodes],
)

export const getSortedExploreEpisodesForPlayer = R.pipe(
  getExploreEpisodes,
  R.filter(R.propEq('publicEpisode', true)),
)
