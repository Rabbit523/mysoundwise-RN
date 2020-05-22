import R from 'ramda'
import { connect } from 'react-redux'
import {
  getSortedUpdates,
  getIsUpdatesFetching,
  getIsUpdatesRefreshing,
  getIsUpdatesPagesEnded,
} from '../selectors'
import {
  prepareForTransition,
  requestUpdates,
  refreshUpdates,
} from '../actions'
import { UpdateScreen } from '../screens'

const mapStateToProps = R.applySpec({
  updates: getSortedUpdates,
  isFetching: getIsUpdatesFetching,
  isRefreshing: getIsUpdatesRefreshing,
  isPagesEnded: getIsUpdatesPagesEnded,
})

const mapDispatchToProps = {
  prepareForTransition,
  requestUpdates,
  refreshUpdates,
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateScreen)
