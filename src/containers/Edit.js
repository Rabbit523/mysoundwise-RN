import R from 'ramda'
import { connect } from 'react-redux'
import { requestUpdateUserInfo } from '../actions'
import { getUserInfo } from '../selectors'
import { EditScreen } from '../screens'

const mapStateToProps = R.applySpec({
  userInfo: getUserInfo,
})

const mapDispatchToProps = {
  requestUpdateUserInfo,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditScreen)
