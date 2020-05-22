import R from 'ramda'
import { connect } from 'react-redux'
import { getTracksPositions } from '../selectors'
import { PlayerProgress } from '../components'
import { PLAYER_STORE_KEY } from '../constants'

const mapStateToProps = R.applySpec({
  tracksPositions: getTracksPositions,
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { tracksPositions } = stateProps
  const { episodeId } = ownProps
  const { playPosition, duration, isListened } =
    tracksPositions[episodeId] || {}
  return {
    progress: isListened ? 1 : (playPosition || 0.0001) / (duration || 1),
  }
}

export default connect(mapStateToProps, undefined, mergeProps, {
  storeKey: PLAYER_STORE_KEY,
})(PlayerProgress)
