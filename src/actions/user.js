import { createAction } from 'redux-actions'

// Action Types

export const REQUEST_USER_INFO = 'soundwise/user/REQUEST_USER_INFO'

export const REQUEST_OTHER_USER_INFO = 'soundwise/user/REQUEST_OTHER_USER_INFO'

export const RECEIVE_USER_INFO = 'soundwise/user/RECEIVE_USER_INFO'

export const RECEIVE_OTHER_USER_INFO = 'soundwise/user/RECEIVE_OTHER_USER_INFO'

export const OPEN_SUBSCRIPTIONS_CHANNEL =
  'soundwise/user/OPEN_SUBSCRIPTIONS_CHANNEL'

export const CLOSE_SUBSCRIPTIONS_CHANNEL =
  'soundwise/user/CLOSE_SUBSCRIPTIONS_CHANNEL'

export const SELECT_USER = 'soundwise/user/SELECT_USER'

export const REQUEST_UPDATE_USER_INFO =
  'soundwise/user/REQUEST_UPDATE_USER_INFO'

export const RECEIVE_UPDATE_USER_INFO =
  'soundwise/user/RECEIVE_UPDATE_USER_INFO'

export const REQUEST_WEEK_STATISTICS = 'soundwise/user/REQUEST_WEEK_STATISTICS'

export const REQUEST_OTHER_WEEK_STATISTICS =
  'soundwise/user/REQUEST_OTHER_WEEK_STATISTICS'

export const RECEIVE_WEEK_STATISTICS = 'soundwise/user/RECEIVE_WEEK_STATISTICS'

export const RECEIVE_OTHER_WEEK_STATISTICS =
  'soundwise/user/RECEIVE_OTHER_WEEK_STATISTICS'

export const REQUEST_MONTH_STATISTICS =
  'soundwise/user/REQUEST_MONTH_STATISTICS'

export const RECEIVE_OTHER_MONTH_STATISTICS =
  'soundwise/user/RECEIVE_OTHER_MONTH_STATISTICS'

export const RECEIVE_MONTH_STATISTICS =
  'soundwise/user/RECEIVE_MONTH_STATISTICS'

export const REQUEST_OTHER_MONTH_STATISTICS =
  'soundwise/user/REQUEST_OTHER_MONTH_STATISTICS'

export const REQUEST_UNSUBSCRIBE = 'soundwise/user/REQUEST_UNSUBSCRIBE'

export const RECEIVE_UNSUBSCRIBE = 'soundwise/user/RECEIVE_UNSUBSCRIBE'

export const REQUEST_SUBSCRIBE = 'soundwise/user/REQUEST_SUBSCRIBE'

export const RECEIVE_SUBSCRIBE = 'soundwise/user/RECEIVE_SUBSCRIBE'

export const REQUEST_USER_SOUNDCASTS = 'soundwise/user/REQUEST_USER_SOUNDCASTS'

export const RECEIVE_USER_SOUNDCASTS = 'soundwise/user/RECEIVE_USER_SOUNDCASTS'

export const SET_USER_SOUNDCASTS = 'soundwise/user/SET_USER_SOUNDCASTS'

// Action Creators

export const requestUserSoundcasts = createAction(REQUEST_USER_SOUNDCASTS)

export const receiveUserSoundcasts = createAction(RECEIVE_USER_SOUNDCASTS)

export const selectUser = createAction(SELECT_USER)

export const setUserSoundcasts = createAction(SET_USER_SOUNDCASTS)

export const requestUserInfo = createAction(REQUEST_USER_INFO)

export const requestOtherUserInfo = createAction(REQUEST_OTHER_USER_INFO)

export const receiveUserInfo = createAction(RECEIVE_USER_INFO)

export const receiveOtherUserInfo = createAction(RECEIVE_OTHER_USER_INFO)

export const requestUpdateUserInfo = createAction(REQUEST_UPDATE_USER_INFO)

export const receiveUpdateUserInfo = createAction(RECEIVE_UPDATE_USER_INFO)

export const requestUnsubscribe = createAction(REQUEST_UNSUBSCRIBE)

export const receiveUnsubscribe = createAction(RECEIVE_UNSUBSCRIBE)

export const requestSubscribe = createAction(REQUEST_SUBSCRIBE)

export const receiveSubscribe = createAction(RECEIVE_SUBSCRIBE)

export const requestWeekStatistics = createAction(REQUEST_WEEK_STATISTICS)

export const requestOtherWeekStatistics = createAction(
  REQUEST_OTHER_WEEK_STATISTICS,
)

export const receiveWeekStatistics = createAction(RECEIVE_WEEK_STATISTICS)

export const receiveOtherWeekStatistics = createAction(
  RECEIVE_OTHER_WEEK_STATISTICS,
)

export const requestMonthStatistics = createAction(REQUEST_MONTH_STATISTICS)

export const requestOtherMonthStatistics = createAction(
  REQUEST_OTHER_MONTH_STATISTICS,
)

export const receiveMonthStatistics = createAction(RECEIVE_MONTH_STATISTICS)

export const receiveOtherMonthStatistics = createAction(
  RECEIVE_OTHER_MONTH_STATISTICS,
)

export const openSubscriptionsChannel = createAction(OPEN_SUBSCRIPTIONS_CHANNEL)

export const closeSubscriptionsChannel = createAction(
  CLOSE_SUBSCRIPTIONS_CHANNEL,
)
