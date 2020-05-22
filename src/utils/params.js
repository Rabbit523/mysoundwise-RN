import R from 'ramda'

let object
let path

const startParam = function(paramName) {
  path.push(paramName)
  object = R.assocPath(path, {}, object)
  return this
}

const endParam = function() {
  path.pop()
  return this
}

const addProp = function(propName, propValue) {
  object = R.assocPath([...path, propName], propValue, object)
  return this
}

const end = () => object

export const params = () => {
  object = {}
  path = []
  return { startParam, endParam, addProp, end }
}
