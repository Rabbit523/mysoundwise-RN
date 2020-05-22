import R from 'ramda'
import { connect } from 'react-redux'
import { getUid } from '../selectors'
import { requestLikeMessage, requestUnlikeMessage } from '../actions'
import { Message } from '../components'

const mapStateToProps = R.applySpec({
  userId: getUid,
})

const mapDispatchToProps = {
  likeMessage: requestLikeMessage,
  unlikeMessage: requestUnlikeMessage,
}

export default connect(mapStateToProps, mapDispatchToProps)(Message)
