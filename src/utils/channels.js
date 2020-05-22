import R from 'ramda'
import { call, take, cancel, cancelled, fork, select } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { ENTITY_SELECTOR_TYPES } from '../constants'
import { TEST_BASE_URL } from '../api'
import firebase from 'react-native-firebase'

const createEventChannel = (pathToListen, eventType) => {
  const listener = eventChannel(emit => {
    const itemsRef = firebase.database(TEST_BASE_URL).ref(pathToListen)
    const event = data => emit(data)
    itemsRef.on(eventType, event)
    return () => itemsRef.off(eventType, event)
  })

  return listener
}

const whatchLiveChannel = function*(
  entity,
  channelType,
  handler,
  pathToListen,
  skipFirstRound,
) {
  const eventChannel = yield call(createEventChannel, pathToListen, channelType)
  try {
    let shouldHandleData = !skipFirstRound
    while (true) {
      const data = yield take(eventChannel)
      if (!shouldHandleData) {
        shouldHandleData = true
        console.log('skip handler: ', pathToListen)
        continue
      }
      yield fork(handler, data, entity)
    }
  } finally {
    if (yield cancelled()) {
      eventChannel.close()
    }
  }
}

export const createLiveChannel = function*({
  openChannelAction,
  closeChannelAction,
  eventType,
  handler,
  entitySelector,
  entitySelectorType = ENTITY_SELECTOR_TYPES.SELECTOR,
  skipFirstRound = false,
  onInitChannel,
  firebasePaths: { beforeEntity, afterEntity },
}) {
  let task

  while (true) {
    let entity
    if (entitySelectorType === ENTITY_SELECTOR_TYPES.CHANNEL) {
      entity = R.prop('payload', yield take(openChannelAction))
      console.log('CHANNEL: firebase-entity = ', entity)
    } else {
      console.log('ENTITY_SELECTOR: type = ', entitySelectorType)
      yield take(openChannelAction)
      if (entitySelectorType === ENTITY_SELECTOR_TYPES.SELECTOR) {
        entity = yield select(entitySelector)
      } else {
        entity = entitySelector
      }
      console.log('ENTITY_SELECTOR: firebase-entity = ', entity)
    }
    if (onInitChannel) {
      console.log('onInitChannel with entity')
      yield call(onInitChannel, entity)
    }
    const pathToListen = [beforeEntity, entity, afterEntity].join('/')
    console.log('pathToListen = ', pathToListen)
    task = yield fork(
      whatchLiveChannel,
      entity,
      eventType,
      handler,
      pathToListen,
      skipFirstRound,
    )
    yield take(closeChannelAction)
    yield cancel(task)
  }
}

export const createDynamicLiveChannel = function*({
  closeChannelAction,
  eventType,
  handler,
  onInitChannel,
  entity,
  pathToListen,
  skipFirstRound,
}) {
  let task

  console.log(
    'createDynamicLiveChannel: eventType = ',
    eventType,
    ', pathToListen = ',
    pathToListen,
  )  
  if (onInitChannel) {
    yield call(onInitChannel, entity)
  }

  task = yield fork(
    whatchLiveChannel,
    entity,
    eventType,
    handler,
    pathToListen,
    skipFirstRound,
  )
  while (true) {
    const { payload: newEntity } = yield take(closeChannelAction)
    if (newEntity === entity) {
      yield cancel(task)
      break
    }
  }
}
