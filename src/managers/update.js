import R from 'ramda'
// import API from '../api'
// import axios from 'axios'
import { /* params, */ mutateUpdate } from '../utils'
import moment from 'moment'
import { UPDATE_TYPES } from '../constants'

const sleep = () =>
  new Promise(res => {
    setTimeout(res, Math.random() * 1000)
  })

let updates = [
  {
    id: `${Math.random()}ev`,
    firstName: 'Nick',
    lastName: 'Vovk',
    type: UPDATE_TYPES.NEW_EPISODE,
    avatarUrl: 'https://78.media.tumblr.com/avatar_55080e2910bb_128.pnj',
    story: '<b>Nick</b> added new <b>episode</b>',
    episodeId: '1514244328943e',
    soundcastId: '1505855025645s',
    timestamp: moment('2010-10-20').unix(),
  },
  {
    id: `${Math.random()}ev`,
    firstName: 'Nick',
    lastName: 'Vovk',
    type: UPDATE_TYPES.LIKE_EPISODE,
    avatarUrl: 'https://78.media.tumblr.com/avatar_55080e2910bb_128.pnj',
    story: '<b>Nick</b> liked <b>episode</b>',
    episodeId: '1514244328943e',
    soundcastId: '1505855025645s',
    timestamp: moment('2010-10-20').unix(),
  },
  {
    id: `${Math.random()}ev`,
    firstName: 'Nick',
    lastName: 'Vovk',
    type: UPDATE_TYPES.COMMENT_EPISODE,
    avatarUrl: 'https://78.media.tumblr.com/avatar_55080e2910bb_128.pnj',
    story: '<b>Nick</b> commented <b>episode</b>',
    episodeId: '1514244328943e',
    soundcastId: '1505855025645s',
    timestamp: moment('2017-10-20').unix(),
  },
  {
    id: `${Math.random()}ev`,
    firstName: 'Nick',
    lastName: 'Vovk',
    type: UPDATE_TYPES.NEW_MESSAGE,
    avatarUrl: 'https://78.media.tumblr.com/avatar_55080e2910bb_128.pnj',
    story: '<b>Nick</b> added new <b>message</b>',
    messageId: '1528643053453a',
    soundcastId: '1505855025645s',
    timestamp: moment('2017-10-20').unix(),
  },
]
// for (let i = 0; i < 34; i++) {
//   updates.push({
//     id: `${Math.random()}ev`,
//     firstName: 'Nick',
//     lastName: 'Vovk',
//     type: UPDATE_TYPES.NEW_EPISODE,
//     avatarUrl: 'https://78.media.tumblr.com/avatar_55080e2910bb_128.pnj',
//     story: '<b>Nick</b> Hello from <b>Russia!</b>',
//     episodeId: '1505945612020e',
//     soundcastId: '1505855025645s',
//     timestamp: moment('2010-10-20').unix(),
//   })
// }

export const getUpdates = (userId, page, limit) => {
  //   const axiosParams = params()
  //     .startParam('filter')
  //     .startParam('where')
  //     .addProp('userId', userId)
  //     .endParam()
  //     .addProp('skip', page * limit)
  //     .addProp('limit', limit)
  //     .end()
  //   return axios.get(API.UPDATES, { params: axiosParams }).then(R.pipe(R.prop('data'), R.indexBy(R.prop('eventId'))))
  return sleep()
    .then(() => updates.slice(page * limit, (page + 1) * limit))
    .then(
      R.pipe(
        R.map(mutateUpdate),
        R.indexBy(R.prop('eventId')),
      ),
    )
}

const episodeUpdate = {
  id: `${Math.random()}ev`,
  firstName: 'Nick',
  lastName: 'Vovk',
  type: UPDATE_TYPES.NEW_EPISODE,
  avatarUrl: 'https://78.media.tumblr.com/avatar_55080e2910bb_128.pnj',
  story: '<b>Nick</b> Hello from <b>Russia!</b>',
  episodeId: '1505945612020e',
  timestamp: moment('2010-10-20').unix(),
}

export const getUpdateById = updateId => {
  //   const axiosParams = params()
  //     .startParam('filter')
  //     .startParam('where')
  //     .addProp('eventId', updateId)
  //     .endParam()
  //     .end()
  //   return axios
  //     .get(API.UPDATES, { params: axiosParams })
  //     .then(R.pipe(R.prop('data'), R.of, R.indexBy(R.prop('eventId'))))
  return sleep()
    .then(() => episodeUpdate)
    .then(
      R.pipe(
        mutateUpdate,
        R.of,
        R.indexBy(R.prop('eventId')),
      ),
    )
}
