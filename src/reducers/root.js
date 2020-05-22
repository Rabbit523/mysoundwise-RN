import { default as auth } from './auth'
import { default as user } from './user'
import { default as like } from './like'
import { default as update } from './update'
import { default as episode } from './episode'
import { default as message } from './message'
import { default as comment } from './comment'
import { default as listener } from './listener'
import { default as category } from './category'
import { default as soundcast } from './soundcast'
import { default as publisher } from './publisher'

// export const initialState = {
//   auth: {
//     isAuthentificated: 'NO_REQUEST',
//     isFetchingEmailForm: false,
//     isFetchingFacebookConnection: false,
//     isIdentificated: 'NO_REQUEST',
//     isSignedIn: false,
//   },
//   user: {
//     isFetchingInfo: false,
//     isFetchingMonthStatistics: false,
//     isFetchingSubscribe: false,
//     isFetchingUnsubscribe: false,
//     isFetchingUserSoundcasts: false,
//     isFetchingWeekStatistics: false,
//     monthStatistics: {
//       comments: 0,
//       likes: 0,
//       listened: 0,
//     },
//     otherMonthStatistics: {
//       comments: 0,
//       likes: 0,
//       listened: 0,
//     },
//     otherUserInfo: {},
//     otherWeekStatistics: {
//       comments: 0,
//       likes: 0,
//       listened: 0,
//     },
//     selectedUser: null,
//     uid: '',
//     userInfo: {},
//     weekStatistics: {
//       comments: 0,
//       likes: 0,
//       listened: 0,
//     },
//   },
//   like: {
//     isFetching: false,
//     items: {},
//   },
//   update: {
//     isFetching: false,
//     isPreparing: false,
//     items: {},
//     pagination: {
//       isPagesEnded: false,
//       isRefreshing: false,
//       page: 0,
//     },
//   },
//   episode: {
//     fetching: {
//       isFetchingEpisodeComments: {},
//       isFetchingEpisodes: false,
//     },
//     items: {},
//     localItems: {},
//     viewedEpisode: '',
//   },
//   message: {
//     fetching: {
//       isFetchingMessageComments: {},
//       isFetchingMessages: false,
//       isRefreshingMessageComments: {},
//       isRefreshingMessages: false,
//     },
//     items: {},
//     viewedMessage: '',
//     viewedSubscription: '',
//   },
//   comment: {},
//   category: {
//     categories: [],
//     fetching: {
//       isFetchingCategories: false,
//       isFetchingCategorySoundcasts: false,
//       isFetchingSuggestions: false,
//       isRefreshingCategories: false,
//       isSearchingSoundcasts: false,
//     },
//     pagination: {},
//     searchPagination: {
//       isPagesEnded: false,
//       page: 0,
//     },
//     searchWord: '',
//     viewedCategory: '',
//   },
//   listener: {
//     isFetching: false,
//     items: {},
//   },
//   soundcast: {
//     isFetchingExploreSoundcast: false,
//     items: {},
//     viewedBundleSoundcast: '',
//     viewedExploreSoundcast: '',
//     viewedSoundcast: '',
//   },
//   publisher: {
//     isFetching: false,
//     items: {},
//   },
// }

export default {
  auth,
  user,
  like,
  update,
  episode,
  message,
  comment,
  category,
  listener,
  soundcast,
  publisher,
}
