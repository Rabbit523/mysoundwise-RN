import R from 'ramda'
import API, { TEST_BASE_URL } from '../api'
import axios from 'axios'
import { params, isExists, mutateSoundcast } from '../utils'
import firebase from 'react-native-firebase'

export const getSoundcasts = (soundcastsIds = []) => {
  let fetchParam = {}
  if (isExists(soundcastsIds)) {
    const axiosParams = params()
    axiosParams
      .startParam('filter')
      .startParam('where')
      .addProp('soundcastId', { inq: soundcastsIds })
    fetchParam = { params: axiosParams.end() }
  }
  return axios
    .get(API.GET_SOUNDCASTS, fetchParam)
    .then(
      R.pipe(
        R.prop('data'),
        R.indexBy(R.prop('soundcastId')),
      ),
    )
    .catch(R.always({}))
}

export const getSoundcastById = soundcastId =>
  firebase
    .database(TEST_BASE_URL)
    .ref(`soundcasts/${soundcastId}`)
    .once('value')
    .then(snapshot => (snapshot.exists() ? snapshot.val() : {}))
    .then(mutateSoundcast)

const sleep = ms => new Promise(res => setTimeout(res, ms))

export const getSoundcastsByCategory = ({ categoryId, limit, page }) =>
  sleep(Math.random() * 3000)
    .then(
      Math.random() > 0.6
        ? R.always([
            {
              soundcastId: '12313s' + categoryId,
              publisherId: 'i',
              title: 'The Book of Souls',
              category: categoryId,
              imageUrl:
                'https://www.pult.ru/upload/iblock/607/607e9bb6c191961707fd1dfab3182eda.jpg',
            },
            {
              soundcastId: '12313123s' + categoryId,
              title: '...And Justice for All',
              publisherId: 'm',
              category: categoryId,
              imageUrl:
                'https://www.emp-online.com/dw/image/v2/BBQV_PRD/on/demandware.static/-/Sites-master-emp/default/dwdf4e0649/images/1/7/7/0/177039.jpg?sfrm=png',
            },
            {
              soundcastId: '1231253s' + categoryId,
              title: 'Master of Puppets',
              publisherId: 'm',
              category: categoryId,
              imageUrl:
                'https://cs9.pikabu.ru/post_img/big/2017/03/27/9/149062831218479766.png',
            },
            {
              soundcastId: '1231252153s' + categoryId,
              title: 'Black Rain',
              publisherId: 'oz',
              category: categoryId,
              imageUrl:
                'https://avatars.yandex.net/get-music-content/49876/b856804d.a.2160665-2/m1000x1000',
            },
            {
              soundcastId: '12312141773s' + categoryId,
              title: 'Bad Magic',
              publisherId: 'mot',
              category: categoryId,
              imageUrl:
                'https://i2.wp.com/www.metalinjection.net/wp-content/uploads/2015/06/motorhead-bad-magic-2015.jpg?fit=638%2C638',
            },
            {
              soundcastId: '1231215677113s' + categoryId,
              title:
                'Mistake asd af sfafa  fasf ga asgsahsah das ashsa hsa hsa ',
              publisherId: 'r',
              category: categoryId,
              imageUrl:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/RHCP_Logo.svg/1200px-RHCP_Logo.svg.png',
            },
          ])
        : R.always([]),
    )
    .then(R.indexBy(R.prop('soundcastId')))

// {
//   const axiosParams = params()
//     .startParam('filter')
//     .addProp('order', 'rank DESC')
//     .startParam('where')
//     .addProp('category', categoryId)
// .addProp('published', true)
// .addProp('landingPage', true)
//     .endParam()
//   if (limit) {
//     axiosParams.addProp('limit', limit)
// if(page) {
//   axiosParams.addProp('skip', page * limit)
// }
//   }

//   return axios
//     .get(API.GET_SOUNDCASTS, { params: axiosParams.end() })
//     .then(R.pipe(R.prop('data'), R.indexBy(R.prop('soundcastId'))))
// }

export const getSoundcastsByCategoriesSeparated = (categories, limit) =>
  Promise.all(
    R.map(
      categoryId => getSoundcastsByCategory({ categoryId, limit }),
      categories,
    ),
  ).then(R.mergeAll)

export const getSoundcastsByPublisher = ({ publisherId, page, limit }) => {
  const axiosParams = params().startParam('filter')
  if (limit) {
    axiosParams.addProp('limit', limit)
    if (page) {
      axiosParams.addProp('skip', page * limit)
    }
  }

  axiosParams
    // .addProp('order', 'rank DESC') FIXME: uncomment when rank added
    .addProp('order', 'title')
    .startParam('where')
    .addProp('publisherId', publisherId)
    .addProp('published', true)
    .addProp('landingPage', true)
  return axios.get(API.GET_SOUNDCASTS, { params: axiosParams.end() }).then(
    R.pipe(
      R.prop('data'),
      R.indexBy(R.prop('soundcastId')),
    ),
  )
}

export const getSoundcastsByPublishersSeparated = (publishers, limit) =>
  Promise.all(
    R.map(publisherId => getSoundcastsByPublisher({ publisherId, limit }))(
      publishers,
    ),
  ).then(R.mergeAll)

export const getSoundcastsByTitle = ({ title, page, limit }) => {
  const axiosParams = params()
  axiosParams.startParam('filter')
  if (limit) {
    axiosParams.addProp('limit', limit)
    if (page) {
      axiosParams.addProp('skip', page * limit)
    }
  }
  axiosParams
    // .addProp('order', 'rank DESC') FIXME: uncomment when rank added
    .addProp('order', 'title')
    .startParam('where')
    .addProp('title', { regexp: `/.*${title}.*/i` })
    .addProp('landingPage', true)
    .addProp('published', true)
  return axios
    .get(API.GET_SOUNDCASTS, { params: axiosParams.end() })
    .then(
      R.pipe(
        R.prop('data'),
        R.indexBy(R.prop('soundcastId')),
      ),
    )
    .catch(R.always({}))
}

export const getSoundcastInfo = soundcastId =>
  firebase
    .database(TEST_BASE_URL)
    .ref(`soundcasts/${soundcastId}`)
    .once('value')

export const getSoundcastListeningSessionCount = soundcastId => {
  const axiosParams = params()
    .startParam('where')
    .addProp('soundcastId', soundcastId)

  return axios
    .get(API.GET_LISTENS_COUNT, { params: axiosParams.end() })
    .then(R.path(['data', 'count']))
    .catch(R.always(0))
}
