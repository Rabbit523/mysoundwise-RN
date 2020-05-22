import _curry2 from './_curry2'
import _arity from './_arity'
import R from 'ramda'

export const createRefMemoizer = (weak = false, onlyLast = false) => {
  const cache = weak && !onlyLast ? new WeakMap() : new Map()
  let counter = 0

  return R.pipe(
    weak && onlyLast
      ? R.converge(
          (fromCache, args) =>
            R.indexOf(undefined, fromCache) === -1
              ? fromCache
              : cache.clear() ||
                R.map(x => cache.set(x, counter) && counter++, args),
          [R.unapply(R.map(x => cache.get(x))), R.unapply(R.identity)],
        )
      : R.unapply(
          R.map(x => cache.get(x) || (cache.set(x, counter) && counter++)),
        ),
    R.join('_'),
  )
}

export const memoizeLastWith = _curry2(function memoizeWith(mFn, fn) {
  let cachedKey
  let cache
  return _arity(fn.length, function() {
    const key = mFn.apply(this, arguments)
    if (cachedKey !== key) {
      cachedKey = key
      cache = fn.apply(this, arguments)
    }
    return cache
  })
})
