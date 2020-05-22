import R from 'ramda'
import firebase from 'react-native-firebase'
import RNFetchBlob from 'rn-fetch-blob'
import { TEST_BASE_URL } from '../api'
import { mutateEpisode } from '../utils'

export const getEpisodesByEpisodesList = episodes => {
  const episodesRef = firebase.database(TEST_BASE_URL).ref('episodes')
  const promises = R.map(
    episodeId =>
      episodesRef
        .child(episodeId)
        .once('value')
        .then(
          snapshot =>
            snapshot.exists()
              ? {
                  [episodeId]: {
                    episodeId,
                    ...mutateEpisode(snapshot.val()),
                  },
                }
              : {},
        ),
    episodes,
  )

  return Promise.all(promises).then(R.mergeAll)
}

export const getEpisodesBySoundcastId = soundcastId =>
  firebase
    .database(TEST_BASE_URL)
    .ref(`soundcasts/${soundcastId}/episodes`)
    .once('value')
    .then(
      snapshot =>
        snapshot.exists()
          ? getEpisodesByEpisodesList(R.keys(snapshot.val()))
          : {},
    )

export const checkIfLocalEpisodesExists = episodes => {
  let promises = []
  for (let episodeId in episodes) {
    promises.push(
      RNFetchBlob.fs
        .exists(episodes[episodeId])
        .then(isExists => isExists && episodeId),
    )
  }
  return Promise.all(promises).then(array => R.filter(R.is(String), array))
}

export const getEpisodeById = episodeId =>
  firebase
    .database(TEST_BASE_URL)
    .ref(`episodes/${episodeId}`)
    .once('value')
    .then(snapshot => (snapshot.exists() ? snapshot.val() : {}))
    .then(episode => ({
      [episodeId]: {
        episodeId,
        ...mutateEpisode(episode),
      },
    }))

export const removeLocalEpisodes = episodes =>
  Promise.all(R.map(path => RNFetchBlob.fs.unlink(path), episodes))
