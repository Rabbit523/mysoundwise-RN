import R from 'ramda'
import { connect } from 'react-redux'
import {
  selectCategory,
  refreshCategories,
  requestCategories,
  requestSuggestions,
  selectExploreSoundcast,
  requestSearchSoundcasts,
} from '../actions'
import {
  getCategories,
  getSearchIsPagesEnded,
  getIsCategoriesFetching,
  getIsSuggestionsFetching,
  getIsSearchingSoundcasts,
  getIsRefreshingCategories,
  getSoundcastsBySearchWord,
  getIsFetchingUserSoundcasts,
} from '../selectors'
import { ExploreScreen } from '../screens'

const mapStateToProps = R.applySpec({
  isFetchingUserSoundcasts: getIsFetchingUserSoundcasts,
  isFetchingSuggestions: getIsSuggestionsFetching,
  isFetchingCategories: getIsCategoriesFetching,
  searchSoundcasts: getSoundcastsBySearchWord,
  isRefreshing: getIsRefreshingCategories,
  isSearching: getIsSearchingSoundcasts,
  isPagesEnded: getSearchIsPagesEnded,
  categories: getCategories,
})

const mapDispatchToProps = {
  selectCategory,
  refreshCategories,
  requestCategories,
  requestSuggestions,
  selectExploreSoundcast,
  requestSearchSoundcasts,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExploreScreen)
