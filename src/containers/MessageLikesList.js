import R from 'ramda'
import { connect } from 'react-redux'
import {
  getViewedMessage,
  getIsLikesFetching,
  getMessageLikesList,
  getSelectedMessageLikesCount,
} from '../selectors'
import { requestLikes, selectUser } from '../actions'
import { LikesListScreen } from '../screens'
import { ENTITIES } from '../constants'

const mapStateToProps = R.applySpec({
  otherProfileRoute: R.always('OtherProfileMessages'),
  entityLikesCount: getSelectedMessageLikesCount,
  entityType: R.always(ENTITIES.MESSAGE),
  likesList: getMessageLikesList,
  isFetching: getIsLikesFetching,
  entityId: getViewedMessage,
})

const mapDispatchToProps = {
  requestLikes,
  selectUser,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LikesListScreen)
