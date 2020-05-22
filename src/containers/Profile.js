import { connect } from 'react-redux'
import R from 'ramda'
import {
  getIsFetchingMonthStatistics,
  getIsFetchingWeekStatistics,
  getMonthStatistics,
  getIsFetchingInfo,
  getWeekStatistics,
  getSelectedUser,
  getUserInfo,
} from '../selectors'
import {
  requestUserInfo,
  requestWeekStatistics,
  requestMonthStatistics,
} from '../actions'
import { ProfileScreen } from '../screens'

const mapStateToProps = R.applySpec({
  isMe: R.T,
  userInfo: getUserInfo,
  selectedUser: getSelectedUser,
  isFetchingInfo: getIsFetchingInfo,
  weekStatistics: getWeekStatistics,
  monthStatistics: getMonthStatistics,
  isFetchingWeekStatistics: getIsFetchingWeekStatistics,
  isFetchingMonthStatistics: getIsFetchingMonthStatistics,
})

const mapDispatchToProps = {
  requestUserInfo,
  requestWeekStatistics,
  requestMonthStatistics,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileScreen)
