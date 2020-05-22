import R from 'ramda'
import { connect } from 'react-redux'
import {
  requestSoundcastsByCategory,
  refreshSoundcastsByCategory,
  selectExploreSoundcast,
} from '../actions'
import {
  getSoundcastsByCategory,
  getIsViewedCategoryPagesEnded,
  getIsViewedCategoryRefreshing,
  getIsFetchingCategorySoundcasts,
} from '../selectors'
import { ExploreDetailsScreen } from '../screens'

const mapStateToProps = R.applySpec({
  category: getSoundcastsByCategory,
  pagesEnded: getIsViewedCategoryPagesEnded,
  isRefreshing: getIsViewedCategoryRefreshing,
  isFetching: getIsFetchingCategorySoundcasts,
})

const mapDispatchToProps = {
  requestSoundcastsByCategory,
  refreshSoundcastsByCategory,
  selectExploreSoundcast,
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ExploreDetailsScreen,
)
