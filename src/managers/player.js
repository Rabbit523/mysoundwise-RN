import API, { TEST_BASE_URL } from '../api'
import axios from 'axios'
import firebase from 'react-native-firebase'
import moment from 'moment'

export const increaseTotalListens = episodeId =>
  firebase
    .database(TEST_BASE_URL)
    .ref(`episodes/${episodeId}/totalListens`)
    .transaction(count => count + 1)

export const addListeningSession = data => {
  const { endPosition, startPosition } = data
  const sessionDuration = endPosition - startPosition
  if (sessionDuration > 0) {
    const date = moment().format('YYYY-MM-DD')
    let createdAt, updatedAt
    createdAt = updatedAt = moment()
      .utc()
      .format()

    const userId = firebase.auth().currentUser.uid
    return axios.post(API.LISTENING_SESSION, {
      userId,
      updatedAt,
      createdAt,
      date,
      sessionDuration,
      ...data,
    })
  }
}
