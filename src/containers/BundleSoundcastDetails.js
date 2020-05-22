import R from 'ramda'
import { connect } from 'react-redux'
import { requestSubscribe, requestExploreSoundcast } from '../actions'
import {
  getIsFetchingSubscribe,
  getBundleExploreEpisodes,
  getIsFetchingExploreSoundcast,
  getExploreBundleSoundcastInfo,
} from '../selectors'
import { SoundcastDetailsScreen } from '../screens'

const mapStateToProps = R.applySpec({
  episodes: getBundleExploreEpisodes,
  soundcast: getExploreBundleSoundcastInfo,
  isFetching: getIsFetchingExploreSoundcast,
  isFetchingSubscribe: getIsFetchingSubscribe,
})

const mapDispatchToProps = {
  requestSubscribe,
  requestExploreSoundcast,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SoundcastDetailsScreen)
