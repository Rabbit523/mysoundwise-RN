import R from 'ramda'
import { connect } from 'react-redux'
import {
  getUid,
  getEpisodeCommentsList,
  getMutatedSelectedEpisode,
  getMutatedSelectedSoundcast,
  getIsViewedEpisodeCommentsFetching,
} from '../selectors'
import {
  editComment,
  commentEpisode,
  uncommentEpisode,
  openEpisodeChannel,
  requestLikeEpisode,
  closeEpisodeChannel,
  requestUnlikeEpisode,
  openEpisodeCommentsChannel,
  closeEpisodeCommentsChannel,
  episodeLoaded,
  updateDownloadTask,
  removeDownloadTask,
} from '../actions'
import { EpisodeDetailsScreen } from '../screens'

const mapStateToProps = R.applySpec({
  isCommentsFetching: getIsViewedEpisodeCommentsFetching,
  selectedSoundcast: getMutatedSelectedSoundcast,
  selectedEpisode: getMutatedSelectedEpisode,
  comments: getEpisodeCommentsList,
  userId: getUid,
})

const mapDispatchToProps = {
  unlikeEpisode: requestUnlikeEpisode,
  likeEpisode: requestLikeEpisode,
  closeEpisodeCommentsChannel,
  openEpisodeCommentsChannel,
  closeEpisodeChannel,
  openEpisodeChannel,
  uncommentEpisode,
  commentEpisode,
  editComment,
  episodeLoaded,
  updateDownloadTask,
  removeDownloadTask,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EpisodeDetailsScreen)
