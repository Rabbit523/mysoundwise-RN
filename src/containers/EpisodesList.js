import R from 'ramda'
import { connect } from 'react-redux'
import {
  episodeLoaded,
  selectEpisode,
  openEpisodeChannel,
  removeLocalEpisode,
  requestLikeEpisode,
  closeEpisodeChannel,
  requestUnlikeEpisode,
  updateDownloadTask,
  removeDownloadTask,
} from '../actions'
import {
  getSelectedSoundcastImage,
  getIsFetchingEpisodes,
  getViewedSoundcast,
  getTracksPositions,
  getUid,
  getDownloadTasks,
} from '../selectors'
import { EpisodesList } from '../components'
import { PLAYER_STORE_KEY } from '../constants'

const mapStateToProps = R.applySpec({
  soundcastImageUrl: getSelectedSoundcastImage,
  isFetching: getIsFetchingEpisodes,
  soundcastId: getViewedSoundcast,
  userId: getUid,
  downloadTasks: getDownloadTasks,
})

const mapDispatchToProps = {
  selectEpisode,
  episodeLoaded,
  openEpisodeChannel,
  closeEpisodeChannel,
  likeEpisode: requestLikeEpisode,
  removeEpisode: removeLocalEpisode,
  unlikeEpisode: requestUnlikeEpisode,
  updateDownloadTask,
  removeDownloadTask,
}

export default R.compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  connect(
    R.applySpec({ startPositions: getTracksPositions }),
    undefined,
    undefined,
    { storeKey: PLAYER_STORE_KEY },
  ),
)(EpisodesList)
