import R from 'ramda'
import { connect } from 'react-redux'
import {
  requestPlayTrack,
  requestPauseTrack,
  selectEpisode,
  fetchTrack,
} from '../actions'
import {
  getIsPlayerPaused,
  getPlayerEpisodes,
  getCurrentTrackId,
  getIsPlayerFetching,
} from '../selectors'
import { PlayButton } from '../components'
import { PLAYER_STORE_KEY } from '../constants'

const mapStateToProps = R.applySpec({
  isPaused: getIsPlayerPaused,
  trackId: getCurrentTrackId,
  isFetching: getIsPlayerFetching,
})

const mapDispatchToProps = {
  requestPlayTrack,
  requestPauseTrack,
  fetchTrack,
}

export default R.compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    undefined,
    {
      storeKey: PLAYER_STORE_KEY,
    },
  ),
  connect(
    R.applySpec({ soundcastEpisodes: getPlayerEpisodes }),
    {
      selectEpisode,
    },
  ),
)(PlayButton)
