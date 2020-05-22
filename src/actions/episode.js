import { createAction } from 'redux-actions'

// Action Types

export const REQUEST_EPISODES = 'soundwise/episode/REQUEST_EPISODES'

export const RECEIVE_EPISODES = 'soundwise/episode/RECEIVE_EPISODES'

export const SELECT_EPISODE = 'soundwise/episode/SELECT_EPISODE'

export const EPISODE_LOADED = 'soundwise/episode/EPISODE_LOADED'

export const REMOVE_LOCAL_EPISODE = 'soundwise/episode/REMOVE_LOCAL_EPISODE'

export const UPDATE_DOWNLOAD_TASK = 'soundwise/episode/UPDATE_DOWNLOAD_TASK'

export const REMOVE_DOWNLOAD_TASK = 'soundwise/episode/REMOVE_DOWNLOAD_TASK'

export const REQUEST_RESTORE_EPISODES =
  'soundwise/episode/REQUEST_RESTORE_EPISODES'

export const RECEIVE_RESTORE_EPISODES =
  'soundwise/episode/RECEIVE_RESTORE_EPISODES'

export const OPEN_EPISODE_CHANNEL = 'soundwise/episode/OPEN_EPISODE_CHANNEL'

export const OPEN_EPISODE_COMMENTS_CHANNEL =
  'soundwise/episode/OPEN_EPISODE_COMMENTS_CHANNEL'

export const CLOSE_EPISODE_COMMENTS_CHANNEL =
  'soundwise/episode/CLOSE_EPISODE_COMMENTS_CHANNEL'

export const CLOSE_EPISODE_CHANNEL = 'soundwise/episode/CLOSE_EPISODE_CHANNEL'

export const UPDATE_EPISODE = 'soundwise/episode/UPDATE_EPISODE'

export const REMOVE_EPISODES = 'soundwise/episode/REMOVE_EPISODES'

// Action Creators

export const requestEpisodes = createAction(REQUEST_EPISODES)

export const receiveEpisodes = createAction(RECEIVE_EPISODES)

export const selectEpisode = createAction(SELECT_EPISODE)

export const episodeLoaded = createAction(EPISODE_LOADED)

export const removeLocalEpisode = createAction(REMOVE_LOCAL_EPISODE)

export const updateDownloadTask = createAction(UPDATE_DOWNLOAD_TASK)

export const removeDownloadTask = createAction(REMOVE_DOWNLOAD_TASK)

export const requestRestoreEpisodes = createAction(REQUEST_RESTORE_EPISODES)

export const receiveRestoreEpisodes = createAction(RECEIVE_RESTORE_EPISODES)

export const openEpisodeCommentsChannel = createAction(
  OPEN_EPISODE_COMMENTS_CHANNEL,
)

export const closeEpisodeCommentsChannel = createAction(
  CLOSE_EPISODE_COMMENTS_CHANNEL,
)

export const openEpisodeChannel = createAction(OPEN_EPISODE_CHANNEL)

export const closeEpisodeChannel = createAction(CLOSE_EPISODE_CHANNEL)

export const updateEpisode = createAction(UPDATE_EPISODE)

export const removeEpisodes = createAction(REMOVE_EPISODES)
