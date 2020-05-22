import R from 'ramda'
import { connect } from 'react-redux'
import {
  requestSubscribe,
  selectBundleSoundcast,
  requestExploreSoundcast,
} from '../actions'
import {
  getExploreEpisodes,
  getBundleSoundcasts,
  getIsFetchingSubscribe,
  getExploreSoundcastInfo,
  getIsFetchingExploreSoundcast,
} from '../selectors'
import { SoundcastDetailsScreen } from '../screens'

const mapStateToProps = R.applySpec({
  episodes: getExploreEpisodes,
  soundcast: getExploreSoundcastInfo,
  bundleSoundcasts: getBundleSoundcasts,
  isFetching: getIsFetchingExploreSoundcast,
  isFetchingSubscribe: getIsFetchingSubscribe,
})

const mapDispatchToProps = {
  requestSubscribe,
  selectBundleSoundcast,
  requestExploreSoundcast,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SoundcastDetailsScreen)
