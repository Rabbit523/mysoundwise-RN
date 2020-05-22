import R from 'ramda'

export const isExists = R.both(R.complement(R.isNil), R.complement(R.isEmpty))
