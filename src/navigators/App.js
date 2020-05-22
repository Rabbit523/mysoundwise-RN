import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { createSwitchNavigator } from 'react-navigation'
import { NetInfo } from 'react-native'
import { LoginContainer } from '../containers'
import Main from './Main'
import { UpdateAlert } from '../components'
import { getUid, getIsPreparingTransition } from '../selectors'
import {
  online,
  offline,
  onlinePlayer,
  offlinePlayer,
  changeTrack,
  refreshMessages,
  requestPauseTrack,
  checkIfAuthorized,
  dispatchAfterAuth,
  prepareForTransition,
  requestContinueTrack,
} from '../actions'
import * as NavigationService from '../NavigationService'
import firebase from 'react-native-firebase'
import { PLAYER_STORE_KEY } from '../constants'
import codePush from 'react-native-code-push'

export const AppSwitchNavigator = createSwitchNavigator(
  {
    Login: {
      screen: LoginContainer,
      navigationOptions: {
        header: null,
      },
    },
    Main,
  },
  {
    initialRouteName: 'Login',
  },
)

const STATUS_TEXT = {
  DOWNLOADING: 'downloading',
  INSTALLING: 'installing',
  INSTALLED: 'installed',
}

class App extends React.Component {
  state = { progress: 0, modalVisible: false, progressStatusText: '' }

  _enableSyncCode = () =>
    codePush.sync(
      {
        updateDialog: true,
        mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,
      },
      this.codePushStatusDidChange,
      this.codePushDownloadDidProgress,
    )

  codePushDownloadDidProgress = progress => {
    const { receivedBytes, totalBytes } = progress
    this.setState({ progress: totalBytes / receivedBytes })
  }

  codePushStatusDidChange = status => {
    switch (status) {
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        codePush.disallowRestart()
        this.setState({
          modalVisible: true,
          progressStatusText: STATUS_TEXT.DOWNLOADING,
        })
        break
      case codePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({ progressStatusText: STATUS_TEXT.INSTALLING })
        break
      case codePush.SyncStatus.UPDATE_INSTALLED:
        codePush.allowRestart()
        this.setState(
          {
            progress: 1,
            progressStatusText: STATUS_TEXT.INSTALLED,
          },
          codePush.allowRestart,
        )
        break
      default:
        this.setState({ modalVisible: false })
    }
  }

  _handlePressOkAndroid = () => this.setState({ modalVisible: false })

  _handlePressOk = () =>
    this.setState({ modalVisible: false }, codePush.restartApp)

  render() {
    const { progress, modalVisible, progressStatusText } = this.state
    return (
      <React.Fragment>
        <AppSwitchNavigator
          ref={ref => (this.navigator = ref)}
          screenProps={R.pick(
            ['uid', 'isPreparingTransition', 'refreshMessages'],
            this.props,
          )}
        />
        <UpdateAlert
          androidRestartText="Changes will take effect the next time you start the application"
          text={`Update in progress!\nPlease do not shut down your device.`}
          onPressOkAndroid={this._handlePressOkAndroid}
          progressStatusText={progressStatusText}
          onPressOk={this._handlePressOk}
          visible={modalVisible}
          okButtonText="Done"
          progress={progress}
        />
      </React.Fragment>
    )
  }

  _enableNotifications = () => {
    const { prepareForTransition, dispatchAfterAuth } = this.props
    firebase
      .notifications()
      .getInitialNotification()
      .then(notificationOpen => {
        if (notificationOpen) {
          const { data, notificationId } = notificationOpen.notification

          dispatchAfterAuth({
            actionCreator: prepareForTransition,
            payload: { ...data, fromNotification: true },
          })
          firebase.notifications().removeDeliveredNotification(notificationId)
        }
      })

    this.messageListener = firebase.notifications().onNotification(message => {
      message.android
        .setChannelId('default_notifications_channel')
        .android.setSmallIcon('ic_launcher')
        .setSound('default')
      firebase.notifications().displayNotification(message)
    })

    this.onNotificationOpened = firebase.notifications().onNotificationOpened(
      R.pipe(
        R.path(['notification', 'data']),
        data => prepareForTransition({ ...data, fromNotification: true }),
      ),
    )
  }

  _handleConnectionChange = isConnected => {
    console.log('isConnected (change) = ', isConnected)
    if (isConnected) {
      this.props.online()
      this.props.onlinePlayer()
    } else {
      this.props.offline()
      this.props.offlinePlayer()
    }
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectionChange,
    )
    NetInfo.isConnected.fetch().done(isConnected => {
      console.log('isConnected = ', isConnected)
      if (isConnected) {
        this.props.online()
        this.props.onlinePlayer()
      } else {
        this.props.offline()
        this.props.offlinePlayer()
      }
    })

    //eslint-disable-next-line
    if (!__DEV__) {
      this._enableSyncCode()
    }
    NavigationService.setNavigator(this.navigator)
    this.props.checkIfSignin()
    this._enableNotifications()
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectionChange,
    )
  }
}

const mapStateToProps = R.applySpec({
  isPreparingTransition: getIsPreparingTransition,
  uid: getUid,
})

const mapDispatchToProps = {
  online,
  offline,
  checkIfSignin: checkIfAuthorized,
  prepareForTransition,
  dispatchAfterAuth,
  refreshMessages,
}

export default R.compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  connect(
    undefined,
    {
      onlinePlayer,
      offlinePlayer,
      changeTrack,
      requestPauseTrack,
      requestContinueTrack,
    },
    undefined,
    { storeKey: PLAYER_STORE_KEY },
  ),
)(App)
