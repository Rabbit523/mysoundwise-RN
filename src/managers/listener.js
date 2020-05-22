import R from 'ramda'
import API from '../api'
import axios from 'axios'
import { params, renameKeys } from '../utils'

const mapListeners = renameKeys({ picURL: 'picUrl' })
export const getListeners = (listenersIds = []) => {
  const axiosParams = params()
  if (!R.isEmpty(listenersIds)) {
    axiosParams
      .startParam('filter')
      .startParam('where')
      .addProp('userId', { inq: listenersIds })
      .endParam()
  }
  return axios.get(API.LISTENERS, { params: axiosParams.end() }).then(
    R.pipe(
      R.prop('data'),
      R.indexBy(R.prop('userId')),
      R.map(mapListeners),
    ),
  )
}
