export const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const replaceDots = string => string.replace(/\./g, '(dot)')

const STATES = {
  OPEN_TAG: 'OPEN_TAG',
  CLOSE_TAG: 'CLOSE_TAG',
  TEXT: 'TEXT',
}
export const parseStringForBolds = string => {
  let state = STATES.TEXT
  let result = []
  let str = ''
  let i = 0
  for (i; i < string.length; i++) {
    // eslint-disable-next-line
    switch (state) {
      case STATES.TEXT:
        if (string[i] === '<') {
          if (string[i + 1] === 'b') {
            result.push([str])
            str = ''
            state = STATES.OPEN_TAG
          } else if (string[i + 1] === '/') {
            result.push([str, 'b'])
            str = ''
            state = STATES.CLOSE_TAG
          } else {
            str += string[i]
          }
        } else {
          str += string[i]
        }
        break
      case STATES.OPEN_TAG:
        if (string[i] === '>') {
          state = STATES.TEXT
        }
        break
      case STATES.CLOSE_TAG:
        if (string[i] === '>') {
          state = STATES.TEXT
        }
        break
    }
  }
  if (str) {
    result.push([str])
  }

  return result
}
