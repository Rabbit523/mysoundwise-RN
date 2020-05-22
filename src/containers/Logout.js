import R from 'ramda'
import { connect } from 'react-redux'
import {
  resetPlayer,
  signout,
  signoutPlayer,
  requestPauseTrack,
} from '../actions'
import { Logout } from '../components'
import { getIsPlayerPaused } from '../selectors'
import { PLAYER_STORE_KEY } from '../constants'

export default R.compose(
  connect(
    R.applySpec({ isPaused: getIsPlayerPaused }),
    { resetPlayer, requestPauseTrack, signoutPlayer },
    undefined,
    {
      storeKey: PLAYER_STORE_KEY,
    },
  ),
  connect(
    undefined,
    { signout },
  ),
)(Logout)
