import R from 'ramda'
import { connect } from 'react-redux'
import { getUid, getUserFullName } from '../selectors'
import { LikeButton } from '../components'

const mapStateToProps = R.applySpec({
  userId: getUid,
  userFullName: getUserFullName,
})

export default connect(mapStateToProps)(LikeButton)
