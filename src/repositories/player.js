import { AsyncStorage } from 'react-native'
import { STORAGE_PREFIX } from '../constants'
import R from 'ramda'

const KEYS = {
  PLAYED_EPISODES: `${STORAGE_PREFIX}PLAYED_EPISODES`,
}

export const addPlayedEpisode = (episodeId, playPosition) =>
  getPlayedEpisodes().then(episodes => {
    return AsyncStorage.setItem(
      KEYS.PLAYED_EPISODES,
      JSON.stringify(R.assoc(episodeId, playPosition, episodes)),
    )
  })

export const removePlayedEpisode = episodeId =>
  getPlayedEpisodes().then(episodes => {
    if (!episodes[episodeId]) return Promise.resolve()
    return AsyncStorage.setItem(
      KEYS.PLAYED_EPISODES,
      JSON.stringify(R.dissoc(episodeId, episodes)),
    )
  })

export const getPlayedEpisodes = () =>
  AsyncStorage.getItem(KEYS.PLAYED_EPISODES)
    .then(episodes => JSON.parse(episodes))
    .then(result => (R.isNil(result) ? {} : result))

export const removePlayedEpisodes = () =>
  AsyncStorage.removeItem(KEYS.PLAYED_EPISODES)

export const replacePlayedEpisodes = episodes =>
  AsyncStorage.setItem(KEYS.PLAYED_EPISODES, JSON.stringify(episodes))
