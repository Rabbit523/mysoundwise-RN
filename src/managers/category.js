import R from 'ramda'
// import firebase from 'react-native-firebase'
// import { ENTITIES, TEST_BASE_URL } from '../constants'

const sleep = ms => new Promise(res => setTimeout(res, ms))

export const getCategories = () =>
  sleep(Math.random() * 1000)
    .then(
      R.always({
        'Category 1': true,
        'Category 2': true,
        'Category 3': true,
      }),
    )
    .then(R.keys)
//   firebase
//     .database(TEST_BASE_URL)
//     .ref('categories')
//     .once('value')
//     .then(snapshot => (snapshot.exists() ? snapshot.val() : {})).then(R.keys)
