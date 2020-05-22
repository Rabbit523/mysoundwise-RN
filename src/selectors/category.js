import R from 'ramda'
import { getSoundcastsById, getNotUserSoundcasts } from './soundcast'
import { memoizeLastWith, createRefMemoizer } from '../utils'
import { getPublishersById } from './publisher'
import { CATEGORY_TYPES } from '../constants'

export const getCategoryState = R.prop('category')

export const getCategoryItems = R.pipe(
  getCategoryState,
  R.prop('categories'),
)

export const getCategoryFetching = R.pipe(
  getCategoryState,
  R.prop('fetching'),
)

export const getIsCategoriesFetching = R.pipe(
  getCategoryFetching,
  R.prop('isFetchingCategories'),
)

export const getIsSuggestionsFetching = R.pipe(
  getCategoryFetching,
  R.prop('isFetchingSuggestions'),
)

export const getIsFetchingCategorySoundcasts = R.pipe(
  getCategoryFetching,
  R.prop('isFetchingCategorySoundcasts'),
)

export const getIsSearchingSoundcasts = R.pipe(
  getCategoryFetching,
  R.prop('isSearchingSoundcasts'),
)

export const getIsRefreshingCategories = R.pipe(
  getCategoryFetching,
  R.prop('isRefreshingCategories'),
)

export const getSearchWord = R.pipe(
  getCategoryState,
  R.prop('searchWord'),
)

export const getViewedCategory = R.pipe(
  getCategoryState,
  R.prop('viewedCategory'),
)

export const getSelectedCategory = R.converge(
  (categoryId, categories) =>
    R.find(R.propEq('categoryId', categoryId), categories),
  [getViewedCategory, getCategoryItems],
)

export const getCategoryPagination = R.pipe(
  getCategoryState,
  R.prop('pagination'),
)

export const getSelectedCategoryPagination = R.converge(R.prop, [
  getViewedCategory,
  getCategoryPagination,
])

export const getIsViewedCategoryPagesEnded = R.pipe(
  getSelectedCategoryPagination,
  R.prop('isPagesEnded'),
)

export const getIsViewedCategoryRefreshing = R.pipe(
  getSelectedCategoryPagination,
  R.prop('isRefreshing'),
)

export const getViewedCategoryPage = R.pipe(
  getSelectedCategoryPagination,
  R.prop('page'),
)

export const getSearchPagination = R.pipe(
  getCategoryState,
  R.prop('searchPagination'),
)

export const getSearchPage = R.pipe(
  getSearchPagination,
  R.prop('page'),
)

export const getSearchIsPagesEnded = R.pipe(
  getSearchPagination,
  R.prop('isPagesEnded'),
)

const processSoundcast = ({ publisherId, ...rest }, publishers) => ({
  ...rest,
  publisherName: R.prop('name', publishers[publisherId]),
})

const processCategory = (
  { categoryId, type },
  soundcasts,
  notUserSoundcasts,
  publishers,
) => {
  // FIXME: remove this on prod
  if (categoryId === '000123456789p') {
    return {}
  }
  const result = {
    title:
      type === CATEGORY_TYPES.SUGGESTION
        ? `Also from ${R.prop('name', publishers[categoryId])}`
        : categoryId,
    categoryId,
    type,
    soundcasts: R.pipe(
      R.pickBy(
        R.propEq(
          type === CATEGORY_TYPES.SUGGESTION ? 'publisherId' : 'category',
          categoryId,
        ),
      ),
      R.map(soundcast => processSoundcast(soundcast, publishers)),
      R.values,
    )(type === CATEGORY_TYPES.SUGGESTION ? notUserSoundcasts : soundcasts),
  }
  return R.isEmpty(result.soundcasts) ? {} : result
}

const processCategories = (
  categories,
  soundcasts,
  notUserSoundcasts,
  publishers,
) =>
  R.pipe(
    R.map(category =>
      processCategory(category, soundcasts, notUserSoundcasts, publishers),
    ),
    R.filter(R.complement(R.isEmpty)),
    R.sort(
      ({ title: titleA, type: typeA }, { title: titleB, type: typeB }) =>
        typeA === typeB
          ? titleA < titleB
            ? -1
            : titleA === titleB
              ? 0
              : 1
          : typeA === CATEGORY_TYPES.SUGGESTION
            ? -1
            : 1,
    ),
  )(categories)

export const getCategories = R.converge(
  memoizeLastWith(createRefMemoizer(true, true), processCategories),
  [
    getCategoryItems,
    getSoundcastsById,
    getNotUserSoundcasts,
    getPublishersById,
  ],
)

export const getSoundcastsByCategory = R.converge(
  memoizeLastWith(createRefMemoizer(true, true), processCategory),
  [
    getSelectedCategory,
    getSoundcastsById,
    getNotUserSoundcasts,
    getPublishersById,
  ],
)

export const getSoundcastsBySearchWord = R.converge(
  memoizeLastWith(
    createRefMemoizer(true, true),
    (word, soundcasts, publishers) =>
      R.pipe(
        R.filter(
          R.pipe(
            R.prop('title'),
            R.toLower,
            R.contains(R.toLower(word)),
          ),
        ),
        R.map(soundcast => processSoundcast(soundcast, publishers)),
        R.values,
        R.sortBy(R.prop('title')), //FIXME: change to rank
      )(soundcasts),
  ),
  [getSearchWord, getSoundcastsById, getPublishersById],
)
