import API from '../api'
import R from 'ramda'
import { params, isExists } from '../utils'
import axios from 'axios'

export const getPublishersByIds = publishersIds => {
  const axiosParams = params()
  if (isExists(publishersIds)) {
    axiosParams
      .startParam('filter')
      .startParam('where')
      .addProp('publisherId', { inq: publishersIds })
  }
  return axios.get(API.PUBLISHERS, { params: axiosParams.end() }).then(
    R.pipe(
      R.prop('data'),
      R.indexBy(R.prop('publisherId')),
    ),
  )
}
