import React from 'react'
import styled from 'styled-components'
import { StyledText, TEXT_COLOR, TEXT_SIZE } from '../components'

const Touchable = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })``

const LogoutButton = Touchable.extend`
  border-width: 2.5px;
  padding: 10px;
  margin-left: 22px;
  margin-right: 22px;
  border-color: ${({ theme }) => theme.color.mainOrange};
`

const LogoutText = StyledText.extend.attrs({
  color: TEXT_COLOR.MAIN_ORANGE,
  size: TEXT_SIZE.XL,
})`
  text-align: center;
`

class Logout extends React.Component {
  render = () => (
    <LogoutButton onPress={this._handlePress}>
      <LogoutText>Log Out</LogoutText>
    </LogoutButton>
  )

  _handlePress = () => {
    const {
      resetPlayer,
      signout,
      signoutPlayer,
      isPaused,
      requestPauseTrack,
    } = this.props
    if (!isPaused) requestPauseTrack()
    resetPlayer()
    signout()
    signoutPlayer()
  }
}

export default Logout
