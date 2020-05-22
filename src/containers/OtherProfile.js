import { connect } from 'react-redux'
import R from 'ramda'
import {
  getIsFetchingInfo,
  getIsFetchingMonthStatistics,
  getIsFetchingWeekStatistics,
  getOtherMonthStatistics,
  getOtherWeekStatistics,
  getSelectedUser,
  getOtherUserInfo,
} from '../selectors'
import { requestOtherUserInfo } from '../actions'
import { ProfileScreen } from '../screens'

const mapStateToProps = R.applySpec({
  userInfo: getOtherUserInfo,
  selectedUser: getSelectedUser,
  isFetchingInfo: getIsFetchingInfo,
  isFetchingMonthStatistics: getIsFetchingMonthStatistics,
  isFetchingWeekStatistics: getIsFetchingWeekStatistics,
  monthStatistics: getOtherMonthStatistics,
  weekStatistics: getOtherWeekStatistics,
})

const mapDispatchToProps = { requestOtherUserInfo }

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileScreen)
