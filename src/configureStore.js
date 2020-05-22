import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import sagaMiddlewareFactory from 'redux-saga'
import { persistStore, persistCombineReducers, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { rootReducer, playerReducer } from './reducers'
import { rootSaga, playerSaga } from './sagas'

const persistConfig = {
  debug: true,
  key: 'root',
  storage,
  whitelist: [
    'auth',
    'user',
    'like',
    // 'update',
    'episode',
    'message',
    'comment',
    'category',
    'listener',
    'soundcast',
    'publisher',
    'downloadTasks',
  ],
}
const playerPersistConfig = {
  debug: true,
  key: 'player',
  storage,
  whitelist: [
    'isSignedIn',
    'playlist',
    // 'isPaused',
    'seekTime',
    'speedRate',
    'isFetching',
    'playlistId',
    'isPlayerShown',
    'currentTrackId',
    'tracksPositions',
    'listeningSession',
  ],
}

export const configureStore = () => {
  const sagaMiddleware = sagaMiddlewareFactory()
  const middleware = applyMiddleware(sagaMiddleware)
  const combineReducer = persistCombineReducers(persistConfig, rootReducer)
  let persistor = null
  const finalReducer = (state, action) => {
    switch (action.type) {
      /*case SIGNIN:
        if (persistor) {
          const promise = new Promise(resolve => resolve(true))
          promise.then(() => {
            console.log('RESUME persist')
            persistor.persist()
          })
        }
        break
      case SIGNOUT:
        if (persistor) {
          const promise = new Promise(resolve => resolve(true))
          promise.then(() => {
            console.log('PAUSE persist')
            persistor.pause()
          })
        }
        break
      case PURGE:
        console.log('PURGING...')
        return initialState*/

      // case PERSIST:
      //   if (persistConfig.debug) {
      //     console.log('root PERSIST:')
      //     console.log('state = ', state)
      //     console.log('action.payload = ', action.payload)
      //   }
      //   break

      case REHYDRATE:
        if (persistConfig.debug) {
          console.log('root REHYDRATE:')
          console.log('root state = ', state)
          console.log('root action.payload = ', action.payload)
        }
        if (
          action.payload &&
          action.payload.auth &&
          action.payload.auth.isSignedIn === false
        ) {
          action.payload = undefined
        }
        break

      default:
        break
    }
    return combineReducer(state, action)
  }
  const store = createStore(
    finalReducer,
    undefined,
    composeWithDevTools(middleware),
  )
  /**
   * persist
   */
  persistor = persistStore(store, null, () => {
    if (persistConfig.debug) {
      // console.log('--Rehydration is finished-- state = ', store.getState())
    }
  })

  sagaMiddleware.run(rootSaga)
  return { store, persistor }
}

export const configurePlayerStore = () => {
  const sagaMiddleware = sagaMiddlewareFactory()
  const middleware = applyMiddleware(sagaMiddleware)
  const combineReducer = persistCombineReducers(
    playerPersistConfig,
    playerReducer,
  )
  const finalReducer = (state, action) => {
    switch (action.type) {
      // case PERSIST:
      //   if (playerPersistConfig.debug) {
      //     console.log('player PERSIST:')
      //     console.log('state = ', state)
      //     console.log('action.payload = ', action.payload)
      //   }
      //   break

      case REHYDRATE:
        if (playerPersistConfig.debug) {
          console.log('player REHYDRATE:')
          console.log('player state = ', state)
          console.log('player action.payload = ', action.payload)
        }
        if (action.payload && action.payload.isSignedIn === false) {
          action.payload = undefined
        }
        break

      default:
        break
    }
    return combineReducer(state, action)
  }
  const playerStore = createStore(finalReducer, composeWithDevTools(middleware))
  /**
   * persist
   */
  const playerPersistor = persistStore(playerStore, null, () => {
    if (playerPersistConfig.debug) {
      // console.log(
      //   '--Rehydration is finished-- playerState = ',
      //   playerStore.getState(),
      // )
    }
  })

  sagaMiddleware.run(playerSaga)
  return { playerStore, playerPersistor }
}
