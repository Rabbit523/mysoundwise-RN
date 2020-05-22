import React from 'react'
import { Provider, createProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { ThemeProvider } from 'styled-components'
import theme from './theme'
import { configureStore, configurePlayerStore } from './configureStore'
import { AppNavigator } from './navigators'
import { PLAYER_STORE_KEY } from './constants'
import moment from 'moment'
import codePush from 'react-native-code-push'

// eslint-disable-next-line
console.ignoredYellowBox = [
  'Remote debugger',
  'Deprecated',
  'Warning: isMounted',
  'TabBarTop',
  'createTab',
  'You should',
  'Method',
]

// console.disableYellowBox = true

const { store, persistor } = configureStore()

const PlayerProvider = createProvider(PLAYER_STORE_KEY)
const { playerStore, playerPersistor } = configurePlayerStore()

/**
 * No persist
 */
// const App = () => (
//   <Provider store={store}>
//       <PlayerProvider store={playerStore}>
//           <ThemeProvider theme={theme}>
//             <AppNavigator />
//           </ThemeProvider>
//       </PlayerProvider>
//   </Provider>
// )

/**
 * persist
 */
const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <PlayerProvider store={playerStore}>
        <PersistGate persistor={playerPersistor}>
          <ThemeProvider theme={theme}>
            <AppNavigator />
          </ThemeProvider>
        </PersistGate>
      </PlayerProvider>
    </PersistGate>
  </Provider>
)

moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: 'a few seconds',
    ss: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1 day',
    dd: '%d days',
  },
})

moment.relativeTimeThreshold('d', 30)

export default codePush({
  appendReleaseDescription: true,
  checkFrequency: codePush.CheckFrequency.MANUAL,
})(App)
