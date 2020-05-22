import R from 'ramda'
import { connect } from 'react-redux'
import { getIsFetchingUserSoundcasts, getUserSoundcasts } from '../selectors'
import { selectSoundcast } from '../actions'
import { SoundcastsScreen } from '../screens'

const mapStateToProps = R.applySpec({
  userSoundcasts: getUserSoundcasts,
  isFetching: getIsFetchingUserSoundcasts,
})

const mapDispatchToProps = {
  selectSoundcast,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SoundcastsScreen)
