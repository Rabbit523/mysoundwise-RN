import { handleActions, handleAction } from 'redux-actions'
import R from 'ramda'
import { combineReducers } from 'redux'
import {
  SIGNOUT,
  SET_SEARCH_WORD,
  SELECT_CATEGORY,
  REQUEST_CATEGORIES,
  RECEIVE_CATEGORIES,
  REQUEST_SUGGESTIONS,
  REQUEST_SEARCH_SOUNDCASTS,
  RECEIVE_SEARCH_SOUNDCASTS,
  RECEIVE_SOUNDCASTS_BY_CATEGORY,
  REFRESH_SOUNDCASTS_BY_CATEGORY,
  REQUEST_SOUNDCASTS_BY_CATEGORY,
  REFRESH_CATEGORIES,
} from '../actions'

const categories = handleActions(
  {
    [RECEIVE_CATEGORIES]: R.useWith(R.union, [R.identity, R.prop('payload')]),
    [SIGNOUT]: R.always([]),
  },
  [],
)

const viewedCategory = handleAction(
  SELECT_CATEGORY,
  (_, { payload }) => payload,
  '',
)

const pagination = handleActions(
  {
    [RECEIVE_CATEGORIES]: (state, { payload }) =>
      R.reduce(
        (acc, { categoryId }) => ({
          ...acc,
          [categoryId]: { page: 0, isPagesEnded: false, isRefreshing: false },
        }),
        state,
        payload,
      ),
    [RECEIVE_SOUNDCASTS_BY_CATEGORY]: R.useWith(
      (state, { categoryId, soundcasts }) =>
        R.evolve(
          {
            [categoryId]: {
              page: R.inc,
              isPagesEnded: R.isEmpty(soundcasts) ? R.T : R.F,
              isRefreshing: R.F,
            },
          },
          state,
        ),
      [R.identity, R.prop('payload')],
    ),
    [REFRESH_SOUNDCASTS_BY_CATEGORY]: R.useWith(
      (state, categoryId) =>
        R.evolve(
          {
            [categoryId]: {
              page: R.always(0),
              isRefreshing: R.T,
              isPagesEnded: R.F,
            },
          },
          state,
        ),
      [R.identity, R.prop('payload')],
    ),
  },
  {},
)

const searchPagination = handleActions(
  {
    [RECEIVE_SEARCH_SOUNDCASTS]: R.useWith(
      (state, soundcasts) =>
        R.evolve(
          { page: R.inc, isPagesEnded: R.isEmpty(soundcasts) ? R.T : R.F },
          state,
        ),
      [R.identity, R.prop('payload')],
    ),
    [SET_SEARCH_WORD]: R.always({ page: 0, isPagesEnded: false }),
  },
  { page: 0, isPagesEnded: false },
)

const searchWord = handleAction(
  SET_SEARCH_WORD,
  (_, { payload }) => payload,
  '',
)

const isSearchingSoundcasts = handleActions(
  {
    [REQUEST_SEARCH_SOUNDCASTS]: R.T,
    [RECEIVE_SEARCH_SOUNDCASTS]: R.F,
  },
  false,
)

const isFetchingCategories = handleActions(
  {
    [REQUEST_CATEGORIES]: R.T,
    [RECEIVE_CATEGORIES]: R.F,
  },
  false,
)

const isFetchingSuggestions = handleActions(
  {
    [REQUEST_SUGGESTIONS]: R.T,
    [RECEIVE_CATEGORIES]: R.F,
  },
  false,
)

const isFetchingCategorySoundcasts = handleActions(
  {
    [REQUEST_SOUNDCASTS_BY_CATEGORY]: R.T,
    [RECEIVE_SOUNDCASTS_BY_CATEGORY]: R.F,
  },
  false,
)

const isRefreshingCategories = handleActions(
  {
    [REFRESH_CATEGORIES]: R.T,
    [RECEIVE_CATEGORIES]: R.F,
  },
  false,
)

const fetching = combineReducers({
  isFetchingCategorySoundcasts,
  isRefreshingCategories,
  isSearchingSoundcasts,
  isFetchingSuggestions,
  isFetchingCategories,
})

export default combineReducers({
  searchPagination,
  viewedCategory,
  categories,
  pagination,
  searchWord,
  fetching,
})
