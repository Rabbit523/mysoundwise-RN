import { AsyncStorage } from 'react-native'
import { STORAGE_PREFIX } from '../constants'
import R from 'ramda'

const KEYS = {
  LOADED_EPISODES: `${STORAGE_PREFIX}LOADED_EPISODES`,
}

export const addLoadedEpisode = (episodeId, localPath) =>
  getLoadedEpisodes().then(episodes => {
    if (episodes[episodeId]) return Promise.resolve()
    return AsyncStorage.setItem(
      KEYS.LOADED_EPISODES,
      JSON.stringify(R.assoc(episodeId, localPath, episodes)),
    )
  })

export const removeLoadedEpisode = episodeId =>
  getLoadedEpisodes().then(episodes => {
    if (!episodes[episodeId]) return Promise.resolve()
    return AsyncStorage.setItem(
      KEYS.LOADED_EPISODES,
      JSON.stringify(R.dissoc(episodeId, episodes)),
    )
  })

export const getLoadedEpisodes = () =>
  AsyncStorage.getItem(KEYS.LOADED_EPISODES)
    .then(episodes => JSON.parse(episodes))
    .then(result => (R.isNil(result) ? {} : result))

export const removeLoadedEpisodes = () =>
  AsyncStorage.removeItem(KEYS.LOADED_EPISODES)

export const replaceLoadedEpisodes = episodes =>
  AsyncStorage.setItem(KEYS.LOADED_EPISODES, JSON.stringify(episodes))
