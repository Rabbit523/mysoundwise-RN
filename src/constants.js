import RNFetchBlob from 'rn-fetch-blob'
import R from 'ramda'

export const AUTH = {
  PROCESS: {
    NO_REQUEST: 'NO_REQUEST',
    YES: 'YES',
    NO: 'NO',
  },
}

export const USER = {
  PERIOD: {
    WEEK: 'WEEK',
    OTHER_WEEK: 'OTHER_WEEK',
    MONTH: 'MONTH',
    OTHER_MONTH: 'OTHER_MONTH',
  },
}

const ROOT_URL = 'https://mysoundwise.com/'

export const URLS = {
  TERMS_OF_USE: `${ROOT_URL}terms`,
  POLICY: `${ROOT_URL}privacy`,
  PASSWORD_RESET: `${ROOT_URL}password_reset`,
  SHARE_EPISODE: `${ROOT_URL}episodes/`,
  SOUNDCASTS: `${ROOT_URL}soundcasts/`,
  CHECKOUT: ({ soundcastId, option }) =>
    `${ROOT_URL}soundcast_checkout?soundcast_id=${soundcastId}${
      R.isNil(option) ? '' : `&checked=${option}`
    }`,
}

export const EPISODES_REQUEST_TYPE = {
  BY_EPISODES_LIST: 'BY_EPISODES_LIST',
  BY_SOUNDCAST_ID: 'BY_SOUNDCAST_ID',
}

export const ARROW_ICON_DIRECTION = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
}

export const APP_NAME = 'soundwise'

export const STORAGE_PREFIX = `@${APP_NAME}:`

export const DOCUMENT_DIR = `${RNFetchBlob.fs.dirs.DocumentDir}/${APP_NAME}/`

export const PLAYER_STORE_KEY = 'PLAYER'

export const TAB_BAR_HEIGHT = 50

export const PLAYER_BAR_HEIGHT = 40

export const ENTITIES = {
  EPISODE: 'EPISODE',
  MESSAGE: 'MESSAGE',
  COMMENT: 'COMMENT',
}

export const EVENT_TYPES = {
  CHILD_ADDED: 'child_added',
  CHILD_REMOVED: 'child_removed',
  CHILD_CHANGED: 'child_changed',
  VALUE: 'value',
}

export const ENTITY_SELECTOR_TYPES = {
  SELECTOR: 'SELECTOR',
  CHANNEL: 'CHANNEL',
  CONSTANT: 'CONSTANT',
}

export const HITSLOP_10 = { left: 10, right: 10, top: 10, bottom: 10 }

export const PAGINATION_LIMITS = {
  CATEGORY_SONDCASTS: 10,
  UPDATES: 15,
}

export const CATEGORY_TYPES = {
  CATEGORY: 'CATEGORY',
  SUGGESTION: 'SUGGESTION',
}

export const UPDATE_TYPES = {
  NEW_EPISODE: 'NEW_EPISODE',
  COMMENT_EPISODE: 'COMMENT_EPISODE',
  LIKE_EPISODE: 'LIKE_EPISODE',
  LIKE_EPISODE_COMMENT: 'LIKE_EPISODE_COMMENT',
  NEW_MESSAGE: 'NEW_MESSAGE',
  COMMENT_MESSAGE: 'COMMENT_MESSAGE',
  LIKE_MESSAGE: 'LIKE_MESSAGE',
  LIKE_MESSAGE_COMMENT: 'LIKE_MESSAGE_COMMENT',
}

export const BILLING_CYCLES = {
  RENTAL: 'rental',
  ANNUAL: 'annual',
  MONTHLY: 'monthly',
  QUATERLY: 'quaterly',
  ONE_TIME: 'one time',
}
