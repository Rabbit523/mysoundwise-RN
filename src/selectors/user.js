import R from 'ramda'

export const getUserState = R.prop('user')

export const getUserInfo = R.pipe(getUserState, R.prop('userInfo'))

export const getOtherUserInfo = R.pipe(getUserState, R.prop('otherUserInfo'))

export const getSelectedUser = R.pipe(getUserState, R.prop('selectedUser'))

export const getUid = R.pipe(getUserState, R.prop('uid'))

export const getUserFirstName = R.pipe(getUserInfo, R.prop('firstName'))

export const getUserLastName = R.pipe(getUserInfo, R.prop('lastName'))

export const getUserFullName = R.converge(
  (firstName, lastName) => [firstName, lastName].join(' '),
  [getUserFirstName, getUserLastName],
)

export const getIsFetchingUserSoundcasts = R.pipe(
  getUserState,
  R.prop('isFetchingUserSoundcasts'),
)

export const getIsFetchingInfo = R.pipe(getUserState, R.prop('isFetchingInfo'))

export const getIsFetchingMonthStatistics = R.pipe(
  getUserState,
  R.prop('isFetchingMonthStatistics'),
)

export const getIsFetchingWeekStatistics = R.pipe(
  getUserState,
  R.prop('isFetchingWeekStatistics'),
)

export const getIsFetchingUnsubscribe = R.pipe(
  getUserState,
  R.prop('isFetchingUnsubscribe'),
)

export const getIsFetchingSubscribe = R.pipe(
  getUserState,
  R.prop('isFetchingSubscribe'),
)

export const getMonthStatistics = R.pipe(
  getUserState,
  R.prop('monthStatistics'),
)

export const getWeekStatistics = R.pipe(getUserState, R.prop('weekStatistics'))

export const getOtherMonthStatistics = R.pipe(
  getUserState,
  R.prop('otherMonthStatistics'),
)

export const getOtherWeekStatistics = R.pipe(
  getUserState,
  R.prop('otherWeekStatistics'),
)

export const getUserSubscriptions = R.pipe(getUserInfo, R.prop('soundcasts'))
