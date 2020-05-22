import R from 'ramda'
import { connect } from 'react-redux'
import {
  getUserSoundcasts,
  getIsFetchingUserSoundcasts,
  getIsFetchingUnsubscribe,
} from '../selectors'
import { signout, requestUnsubscribe } from '../actions'
import { SettingsScreen } from '../screens'

const mapStateToProps = R.applySpec({
  userSoundcasts: getUserSoundcasts,
  isFetchingSoundcasts: getIsFetchingUserSoundcasts,
  isFetchingUnsubscribe: getIsFetchingUnsubscribe,
})

const mapDispatchToProps = {
  requestUnsubscribe,
  logout: signout,
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)
