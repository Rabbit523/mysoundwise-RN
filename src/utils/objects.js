import R from 'ramda'

export const renameKeys = R.curry((keysMap, obj) =>
  R.reduce(
    (acc, key) => R.assoc(keysMap[key] || key, obj[key], acc),
    {},
    R.keys(obj),
  ),
)

// {key: value} => [key, value]
export const toPair = R.pipe(R.toPairs, R.head)
