import R from 'ramda'

export const emailPredicate = email =>
  R.test(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, email)

export const requiredPredicate = R.both(
  R.complement(R.isEmpty),
  R.complement(R.isNil),
)
