import R from 'ramda'
import API from '../api'
import { mutateMessage, params } from '../utils'
import axios from 'axios'

export const getMessagesBySoundcastId = soundcastId => {
  const axiosParams = params()
    .startParam('filter')
    .startParam('where')
    .addProp('soundcastId', soundcastId)

  return axios
    .get(API.MESSAGES, { params: axiosParams.end() })
    .then(
      R.pipe(
        R.prop('data'),
        R.map(mutateMessage),
        R.indexBy(R.prop('messageId')),
      ),
    )
    .catch(R.always({}))
}

export const getMessageById = messageId =>
  axios
    .get(API.MESSAGE_BY_ID(messageId))
    .then(
      R.pipe(
        R.prop('data'),
        mutateMessage,
      ),
    )
    .catch(R.always({}))
