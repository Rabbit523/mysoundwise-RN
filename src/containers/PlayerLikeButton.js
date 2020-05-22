import R from 'ramda'
import { connect } from 'react-redux'
import { requestLikeEpisode, requestUnlikeEpisode } from '../actions'
import {
  getIsUserLikedSelectedEpisode,
  getUid,
  getViewedSoundcast,
} from '../selectors'
import { PlayerLikeButton } from '../components'

const mapStateToProps = R.applySpec({
  userLiked: getIsUserLikedSelectedEpisode,
  userId: getUid,
  selectedSoundcast: getViewedSoundcast,
})

const mapDispatchToProps = {
  likeEpisode: requestLikeEpisode,
  unlikeEpisode: requestUnlikeEpisode,
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerLikeButton)
