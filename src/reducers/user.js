import R from 'ramda'
import { handleActions, combineActions } from 'redux-actions'
import { combineReducers } from 'redux'
import {
  SIGNIN,
  SIGNOUT,
  SELECT_USER,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  COMMENT_EPISODE,
  COMMENT_MESSAGE,
  UNCOMMENT_EPISODE,
  UNCOMMENT_MESSAGE,
  REQUEST_USER_INFO,
  RECEIVE_USER_INFO,
  REQUEST_SUBSCRIBE,
  RECEIVE_SUBSCRIBE,
  REQUEST_UNSUBSCRIBE,
  RECEIVE_UNSUBSCRIBE,
  SET_USER_SOUNDCASTS,
  REQUEST_LIKE_EPISODE,
  REQUEST_LIKE_MESSAGE,
  REQUEST_UNLIKE_EPISODE,
  REQUEST_UNLIKE_MESSAGE,
  REQUEST_USER_SOUNDCASTS,
  RECEIVE_USER_SOUNDCASTS,
  REQUEST_OTHER_USER_INFO,
  REQUEST_WEEK_STATISTICS,
  RECEIVE_WEEK_STATISTICS,
  RECEIVE_OTHER_USER_INFO,
  REQUEST_MONTH_STATISTICS,
  RECEIVE_MONTH_STATISTICS,
  REQUEST_OTHER_WEEK_STATISTICS,
  RECEIVE_OTHER_WEEK_STATISTICS,
  REQUEST_OTHER_MONTH_STATISTICS,
  RECEIVE_OTHER_MONTH_STATISTICS,
} from '../actions'

const isFetchingInfo = handleActions(
  {
    [combineActions(REQUEST_USER_INFO, REQUEST_OTHER_USER_INFO)]: R.T,
    [combineActions(RECEIVE_USER_INFO, RECEIVE_OTHER_USER_INFO)]: R.F,
  },
  false,
)

const isFetchingUserSoundcasts = handleActions(
  {
    [REQUEST_USER_SOUNDCASTS]: R.T,
    [RECEIVE_USER_SOUNDCASTS]: R.F,
  },
  false,
)

const userInfo = handleActions(
  {
    [RECEIVE_USER_INFO]: R.useWith(R.mergeDeepRight, [
      R.identity,
      R.prop('payload'),
    ]),
    [RECEIVE_UNSUBSCRIBE]: R.useWith(
      (state, soundcastId) => R.dissocPath(['soundcasts', soundcastId], state),
      [R.identity, R.prop('payload')],
    ),
    [SET_USER_SOUNDCASTS]: R.useWith(R.flip(R.assoc('soundcasts')), [
      R.identity,
      R.prop('payload'),
    ]),
    [SIGNOUT]: R.always({}),
  },
  {},
)

const otherUserInfo = handleActions(
  {
    [REQUEST_OTHER_USER_INFO]: R.always({}),
    [RECEIVE_OTHER_USER_INFO]: R.useWith(R.mergeDeepRight, [
      R.identity,
      R.prop('payload'),
    ]),
  },
  {},
)

const isFetchingMonthStatistics = handleActions(
  {
    [combineActions(
      REQUEST_MONTH_STATISTICS,
      REQUEST_OTHER_MONTH_STATISTICS,
    )]: R.T,
    [combineActions(
      RECEIVE_MONTH_STATISTICS,
      RECEIVE_OTHER_MONTH_STATISTICS,
    )]: R.F,
  },
  false,
)

const monthStatistics = handleActions(
  {
    [RECEIVE_MONTH_STATISTICS]: (state, { payload }) => R.merge(state, payload),
    [combineActions(
      REQUEST_LIKE_EPISODE,
      LIKE_COMMENT,
      REQUEST_LIKE_MESSAGE,
    )]: R.evolve({
      likes: R.inc,
    }),
    [combineActions(
      REQUEST_UNLIKE_EPISODE,
      REQUEST_UNLIKE_MESSAGE,
      UNLIKE_COMMENT,
    )]: R.evolve({ likes: R.when(R.gt(R.__, 0), R.dec) }),
    [combineActions(COMMENT_EPISODE, COMMENT_MESSAGE)]: R.evolve({
      comments: R.inc,
    }),
    [combineActions(UNCOMMENT_EPISODE, UNCOMMENT_MESSAGE)]: R.evolve({
      comments: R.when(R.gt(R.__, 0), R.dec),
    }),
    [SIGNOUT]: R.always({}),
  },
  { listened: 0, likes: 0, comments: 0 },
)

const otherMonthStatistics = handleActions(
  {
    [RECEIVE_OTHER_MONTH_STATISTICS]: (state, { payload }) =>
      R.merge(state, payload),
  },
  { listened: 0, likes: 0, comments: 0 },
)

const weekStatistics = handleActions(
  {
    [RECEIVE_WEEK_STATISTICS]: (state, { payload }) => R.merge(state, payload),
    [combineActions(
      REQUEST_LIKE_EPISODE,
      LIKE_COMMENT,
      REQUEST_LIKE_MESSAGE,
    )]: R.evolve({
      likes: R.inc,
    }),
    [combineActions(
      REQUEST_UNLIKE_EPISODE,
      REQUEST_UNLIKE_MESSAGE,
      UNLIKE_COMMENT,
    )]: R.evolve({ likes: R.when(R.gt(R.__, 0), R.dec) }),
    [combineActions(COMMENT_EPISODE, COMMENT_MESSAGE)]: R.evolve({
      comments: R.inc,
    }),
    [combineActions(UNCOMMENT_EPISODE, UNCOMMENT_MESSAGE)]: R.evolve({
      comments: R.when(R.gt(R.__, 0), R.dec),
    }),
    [SIGNOUT]: R.always({}),
  },
  { listened: 0, likes: 0, comments: 0 },
)

const otherWeekStatistics = handleActions(
  {
    [RECEIVE_OTHER_WEEK_STATISTICS]: (state, { payload }) =>
      R.merge(state, payload),
  },
  { listened: 0, likes: 0, comments: 0 },
)

const isFetchingWeekStatistics = handleActions(
  {
    [combineActions(
      REQUEST_WEEK_STATISTICS,
      REQUEST_OTHER_WEEK_STATISTICS,
    )]: R.T,
    [combineActions(
      RECEIVE_WEEK_STATISTICS,
      REQUEST_OTHER_WEEK_STATISTICS,
    )]: R.F,
  },
  false,
)

const isFetchingUnsubscribe = handleActions(
  {
    [REQUEST_UNSUBSCRIBE]: R.T,
    [RECEIVE_UNSUBSCRIBE]: R.F,
  },
  false,
)

const isFetchingSubscribe = handleActions(
  {
    [REQUEST_SUBSCRIBE]: R.T,
    [RECEIVE_SUBSCRIBE]: R.F,
  },
  false,
)

const uid = handleActions({ [SIGNIN]: (_, { payload }) => payload }, '')

const selectedUser = handleActions(
  { [SELECT_USER]: (_, { payload }) => payload },
  null,
)

export default combineReducers({
  uid,
  userInfo,
  selectedUser,
  otherUserInfo,
  isFetchingInfo,
  weekStatistics,
  monthStatistics,
  isFetchingSubscribe,
  otherWeekStatistics,
  otherMonthStatistics,
  isFetchingUnsubscribe,
  isFetchingUserSoundcasts,
  isFetchingWeekStatistics,
  isFetchingMonthStatistics,
})
