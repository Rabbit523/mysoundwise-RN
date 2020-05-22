import R from 'ramda'
import { connect } from 'react-redux'
import {
  getIsRefreshingSelectedMessageComments,
  getIsViewedMessageCommentsFetching,
  getMutatedSelectedMessage,
  getMessageCommentsList,
  getUid,
} from '../selectors'
import {
  editComment,
  commentMessage,
  uncommentMessage,
  requestMessageComments,
  requestRefreshMessageComments,
} from '../actions'
import { MessageDetailsScreen } from '../screens'

const mapStateToProps = R.applySpec({
  isRefreshingComments: getIsRefreshingSelectedMessageComments,
  isCommentsFetching: getIsViewedMessageCommentsFetching,
  message: getMutatedSelectedMessage,
  comments: getMessageCommentsList,
  userId: getUid,
})

const mapDispatchToProps = {
  editComment,
  commentMessage,
  uncommentMessage,
  requestMessageComments,
  refreshMessageComments: requestRefreshMessageComments,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessageDetailsScreen)
