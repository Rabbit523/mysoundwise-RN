import React from 'react'
import { Keyboard } from 'react-native'
import { BottomTabBar } from 'react-navigation-tabs'
import { connect } from 'react-redux'
import { PLAYER_STORE_KEY } from '../constants'
import { signinPlayer } from '../actions'

class TabBarComponent extends React.PureComponent {
  state = {
    isVisible: true,
  }

  componentDidMount() {
    this.props.signinPlayer()

    this.keyboardDidShowSub = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    )
    this.keyboardDidHideSub = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    )
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove()
    this.keyboardDidHideSub.remove()
  }

  keyboardDidShow = () => {
    this.setState({
      isVisible: false,
    })
  }

  keyboardDidHide = () => {
    this.setState({
      isVisible: true,
    })
  }

  render() {
    return this.state.isVisible ? <BottomTabBar {...this.props} /> : null
  }
}

export default connect(
  undefined,
  { signinPlayer },
  undefined,
  {
    storeKey: PLAYER_STORE_KEY,
  },
)(TabBarComponent)
