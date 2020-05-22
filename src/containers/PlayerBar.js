import R from 'ramda'
import { connect } from 'react-redux'
import {
  requestContinueTrack,
  requestPauseTrack,
  setCurrentTime,
  setSpeedRate,
  setDuration,
  pauseTrack,
  playTrack,
  fetchTrack,
  seekTime,
  changeTrack,
} from '../actions'
import {
  getIsPlayerFetching,
  getIsPlayerPaused,
  getPlayerSpeedRate,
  getPlayerSeekTime,
  getIsPlayerShown,
  getCurrentTrack,
  getSelectedEpisode,
  getCurrentTrackPosition,
} from '../selectors'
import { PlayerBar } from '../components'
import { PLAYER_STORE_KEY } from '../constants'

const mapStateToProps = R.applySpec({
  isFetching: getIsPlayerFetching,
  isPlayerShown: getIsPlayerShown,
  isPaused: getIsPlayerPaused,
  speedRate: getPlayerSpeedRate,
  track: getCurrentTrack,
  playerSeekTime: getPlayerSeekTime,
  currentTrackPosition: getCurrentTrackPosition,
})

const mapDispatchToProps = {
  seekTime,
  changeTrack,
  playTrack,
  fetchTrack,
  pauseTrack,
  setDuration,
  setSpeedRate,
  setCurrentTime,
  requestPauseTrack,
  requestContinueTrack,
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
  connect(R.applySpec({ episode: getSelectedEpisode })),
)(PlayerBar)
