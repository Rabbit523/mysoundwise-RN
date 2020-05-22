import R from 'ramda'
import { Alert } from 'react-native'
import { all, call, takeLatest, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import {
  REFRESH_CATEGORIES,
  REQUEST_CATEGORIES,
  REQUEST_SUGGESTIONS,
  REQUEST_SEARCH_SOUNDCASTS,
  REQUEST_SOUNDCASTS_BY_CATEGORY,
  REFRESH_SOUNDCASTS_BY_CATEGORY,
  setSearchWord,
  receiveCategories,
  requestPublishers,
  receivePublishers,
  receiveSoundcasts,
  receiveSearchSoundcasts,
  receiveSoundcastsByCategory,
} from '../actions'
import {
  getCategories,
  getPublishersByIds,
  getSoundcastsByTitle,
  getSoundcastsByCategory,
  getSoundcastsByPublisher,
  getSoundcastsByPublishersSeparated,
  getSoundcastsByCategoriesSeparated,
} from '../managers'
import { PAGINATION_LIMITS, CATEGORY_TYPES } from '../constants'
import {
  getSearchWord,
  getUserSoundcasts,
  getPublishersAllId,
  getSelectedCategory,
  getSearchPagination,
  getViewedCategoryPage,
  getIsViewedCategoryPagesEnded,
} from '../selectors'
import { isExists } from '../utils'

const requestCategoryWorker = function*() {
  let categories = []
  try {
    categories = yield call(getCategories)
    const soundcasts = yield call(
      getSoundcastsByCategoriesSeparated,
      categories,
      PAGINATION_LIMITS.CATEGORY_SONDCASTS,
    )
    yield put(receiveSoundcasts(soundcasts))
    const allPublishers = yield select(getPublishersAllId)
    const publishers = R.pipe(
      R.values,
      R.map(R.prop('publisherId')),
      R.uniq,
    )(soundcasts)
    let neededPublishers = R.difference(publishers, allPublishers)
    if (neededPublishers.length) {
      yield put(requestPublishers())
      neededPublishers = yield call(getPublishersByIds, neededPublishers)
      yield put(receivePublishers(neededPublishers))
    }
    categories = R.map(
      categoryId => ({
        categoryId,
        type: CATEGORY_TYPES.CATEGORY,
      }),
      categories,
    )
  } catch (error) {
    Alert.alert('Error', 'Failed to load categories', [{ text: 'OK' }])
  }
  yield put(receiveCategories(categories))
}

const requestCategoryWatcher = function*() {
  yield takeLatest(REQUEST_CATEGORIES, requestCategoryWorker)
}

const requestSuggestionWorker = function*() {
  let categories = []
  try {
    const userSoundcasts = yield select(getUserSoundcasts)
    let publishers = R.pipe(
      R.values,
      R.reduce(
        (acc, { publisherId }) =>
          R.contains(publisherId, acc) ? acc : R.append(publisherId, acc),
        [],
      ),
    )(userSoundcasts)

    const soundcasts = yield call(
      getSoundcastsByPublishersSeparated,
      publishers,
      PAGINATION_LIMITS.CATEGORY_SONDCASTS,
    )
    yield put(receiveSoundcasts(soundcasts))

    const allPublishers = yield select(getPublishersAllId)
    let neededPublishers = R.difference(publishers, allPublishers)
    if (neededPublishers.length) {
      yield put(requestPublishers())
      neededPublishers = yield call(getPublishersByIds, neededPublishers)
      yield put(receivePublishers(neededPublishers))
    }

    categories = R.map(
      categoryId => ({
        categoryId,
        type: CATEGORY_TYPES.SUGGESTION,
      }),
      publishers,
    )
  } catch (error) {
    Alert.alert('Error', 'Failed to load suggestions', [{ text: 'OK' }])
  }
  yield put(receiveCategories(categories))
}

const requestSuggestionWatcher = function*() {
  yield takeLatest(REQUEST_SUGGESTIONS, requestSuggestionWorker)
}

const requestCategorySoundcastsWorker = function*() {
  let soundcasts = {}
  const isPagesEnded = yield select(getIsViewedCategoryPagesEnded)
  const { categoryId, type } = yield select(getSelectedCategory)
  try {
    if (!isPagesEnded) {
      const page = yield select(getViewedCategoryPage)
      if (type === CATEGORY_TYPES.CATEGORY) {
        soundcasts = yield call(getSoundcastsByCategory, {
          categoryId,
          page,
          limit: PAGINATION_LIMITS.CATEGORY_SONDCASTS,
        })
      } else {
        soundcasts = yield call(getSoundcastsByPublisher, {
          publisherId: categoryId,
          page,
          limit: PAGINATION_LIMITS.CATEGORY_SONDCASTS,
        })
      }
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to load the category soundcasts', [
      { text: 'OK' },
    ])
  }
  yield put(receiveSoundcastsByCategory({ soundcasts, categoryId }))
}

const requestCategorySoundcastsWatcher = function*() {
  yield takeLatest(
    [REQUEST_SOUNDCASTS_BY_CATEGORY, REFRESH_SOUNDCASTS_BY_CATEGORY],
    requestCategorySoundcastsWorker,
  )
}

const searchSoundcastsWorker = function*({ payload: searchWord }) {
  let soundcasts = {}

  try {
    if (isExists(searchWord)) {
      yield call(delay, 1000)
      const currentSearchWord = yield select(getSearchWord)
      if (currentSearchWord !== searchWord) {
        yield put(setSearchWord(searchWord))
      }

      const { page, isPagesEnded } = yield select(getSearchPagination)
      if (isPagesEnded) {
        yield put(receiveSearchSoundcasts(soundcasts))
        return
      }

      soundcasts = yield call(getSoundcastsByTitle, {
        title: searchWord,
        page,
        limit: PAGINATION_LIMITS.CATEGORY_SONDCASTS,
      })

      const publishers = R.pipe(
        R.map(R.prop('publisherId')),
        R.values,
      )(soundcasts)
      const allPublishers = yield select(getPublishersAllId)
      let neededPublishers = R.difference(publishers, allPublishers)
      if (neededPublishers.length) {
        yield put(requestPublishers())
        neededPublishers = yield call(getPublishersByIds, neededPublishers)
        yield put(receivePublishers(neededPublishers))
      }
    }
  } catch (error) {
    // console.log(error)
    Alert.alert('Error', 'Failed to search soundcasts', [{ text: 'OK' }])
  }

  yield put(receiveSearchSoundcasts(soundcasts))
}

const searchSoundcastsWatcher = function*() {
  yield takeLatest(REQUEST_SEARCH_SOUNDCASTS, searchSoundcastsWorker)
}

const refreshCategoriesWorker = function*() {
  yield all([/*call(requestCategoryWorker) */ call(requestSuggestionWorker)])
}

const refreshCategoriesWatcher = function*() {
  yield takeLatest(REFRESH_CATEGORIES, refreshCategoriesWorker)
}

export default function*() {
  yield all([
    call(requestCategoryWatcher),
    call(searchSoundcastsWatcher),
    call(refreshCategoriesWatcher),
    call(requestSuggestionWatcher),
    call(requestCategorySoundcastsWatcher),
  ])
}
