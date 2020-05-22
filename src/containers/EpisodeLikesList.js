import R from 'ramda'
import { connect } from 'react-redux'
import {
  getViewedEpisode,
  getIsLikesFetching,
  getEpisodeLikesList,
  getSelectedEpisodeLikesCount,
} from '../selectors'
import { requestLikes, selectUser } from '../actions'
import { LikesListScreen } from '../screens'
import { ENTITIES } from '../constants'

const mapStateToProps = R.applySpec({
  otherProfileRoute: R.always('OtherProfileSoundcasts'),
  entityLikesCount: getSelectedEpisodeLikesCount,
  entityType: R.always(ENTITIES.EPISODE),
  likesList: getEpisodeLikesList,
  isFetching: getIsLikesFetching,
  entityId: getViewedEpisode,
})

const mapDispatchToProps = {
  requestLikes,
  selectUser,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LikesListScreen)
