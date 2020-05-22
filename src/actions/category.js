import { createAction } from 'redux-actions'

// Action Types

export const REQUEST_CATEGORIES = 'soundwise/category/REQUEST_CATEGORIES'

export const RECEIVE_CATEGORIES = 'soundwise/category/RECEIVE_CATEGORIES'

export const REFRESH_CATEGORIES = 'soundwise/category/REFRESH_CATEGORIES'

export const REQUEST_SUGGESTIONS = 'soundwise/category/REQUEST_SUGGESTIONS'

export const REQUEST_SOUNDCASTS_BY_CATEGORY =
  'soundwise/category/REQUEST_SOUNDCASTS_BY_CATEGORY'

export const RECEIVE_SOUNDCASTS_BY_CATEGORY =
  'soundwise/category/RECEIVE_SOUNDCASTS_BY_CATEGORY'

export const REFRESH_SOUNDCASTS_BY_CATEGORY =
  'soundwise/category/REFRESH_SOUNDCASTS_BY_CATEGORY'

export const REQUEST_SEARCH_SOUNDCASTS =
  'soundwise/category/REQUEST_SEARCH_SOUNDCASTS'

export const RECEIVE_SEARCH_SOUNDCASTS =
  'soundwise/category/RECEIVE_SEARCH_SOUNDCASTS'

export const SET_SEARCH_WORD = 'soundwise/category/SET_SEARCH_WORD'

export const SELECT_CATEGORY = 'soundwise/category/SELECT_CATEGORY'

// Action Creators

export const requestCategories = createAction(REQUEST_CATEGORIES)

export const receiveCategories = createAction(RECEIVE_CATEGORIES)

export const refreshCategories = createAction(REFRESH_CATEGORIES)

export const requestSoundcastsByCategory = createAction(
  REQUEST_SOUNDCASTS_BY_CATEGORY,
)

export const receiveSoundcastsByCategory = createAction(
  RECEIVE_SOUNDCASTS_BY_CATEGORY,
)

export const refreshSoundcastsByCategory = createAction(
  REFRESH_SOUNDCASTS_BY_CATEGORY,
)

export const requestSearchSoundcasts = createAction(REQUEST_SEARCH_SOUNDCASTS)

export const receiveSearchSoundcasts = createAction(RECEIVE_SEARCH_SOUNDCASTS)

export const selectCategory = createAction(SELECT_CATEGORY)

export const setSearchWord = createAction(SET_SEARCH_WORD)

export const requestSuggestions = createAction(REQUEST_SUGGESTIONS)
