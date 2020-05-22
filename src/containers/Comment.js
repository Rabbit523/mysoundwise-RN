import R from 'ramda'
import { connect } from 'react-redux'
import { likeComment, unlikeComment, selectUser } from '../actions'
import { getUid } from '../selectors'
import { Comment } from '../components'

const mapStateToProps = R.applySpec({
  userId: getUid,
})

const mapDispatchToProps = {
  selectUser,
  likeComment,
  unlikeComment,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Comment)
