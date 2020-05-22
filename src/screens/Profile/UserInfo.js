import React from 'react'
import R from 'ramda'
import styled from 'styled-components'
import {
  Avatar,
  Preloader,
  StyledText,
  TEXT_SIZE,
  TEXT_COLOR,
  TEXT_WEIGHT,
} from '../../components'
import { Linking } from 'react-native'
import { HITSLOP_10 } from '../../constants'

const BioContainer = styled.View`
  align-items: center;
  margin-bottom: 50px;
`

const Text = StyledText.extend.attrs({
  size: TEXT_SIZE.XXXM,
})`
  text-align: center;
`

const BioHeader = StyledText.extend.attrs({
  size: TEXT_SIZE.XL,
  color: TEXT_COLOR.ALMOST_BLACK,
  weight: TEXT_WEIGHT.BOLD,
})`
  text-align: center;
  margin-top: 11px;
`

const BioLink = StyledText.extend.attrs({
  color: TEXT_COLOR.LINK_BLUE,
  size: TEXT_SIZE.XXXM,
})`
  margin-top: 9px;
  text-align: center;
`

const Touchable = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
  hitSlop: HITSLOP_10,
})``

const EditProfile = Touchable.extend`
  border-radius: 8px;
  padding: 5px 18px;
  border-color: ${({ theme }) => theme.color.border};
  border-width: 1px;
  margin-top: 12px;
`
class UserInfo extends React.PureComponent {
  _handlePressUrl = () => {
    const { websiteUrl } = this.props
    Linking.openURL(
      websiteUrl.toLowerCase().startsWith('http')
        ? websiteUrl
        : `http://${websiteUrl}`,
    )
  }

  render() {
    const {
      info,
      isMe,
      imageUrl,
      lastName,
      firstName,
      websiteUrl,
      isFetching,
      onEditProfile,
    } = this.props
    return isFetching ? (
      <Preloader />
    ) : (
      <BioContainer>
        <Avatar
          size={94}
          imageUrl={imageUrl}
          firstName={firstName}
          lastName={lastName}
        />
        <BioHeader>{[firstName, lastName].join(' ')}</BioHeader>
        {!R.isEmpty(info) && <Text>{info}</Text>}
        {!R.isEmpty(websiteUrl) && (
          <Touchable onPress={this._handlePressUrl}>
            <BioLink>{websiteUrl}</BioLink>
          </Touchable>
        )}
        {isMe && (
          <EditProfile onPress={onEditProfile}>
            <Text>Edit Profile</Text>
          </EditProfile>
        )}
      </BioContainer>
    )
  }
}

export default UserInfo
