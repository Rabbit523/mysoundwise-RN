import React from 'react'
import R from 'ramda'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { StyledText, TEXT_SIZE } from '../../components'
import { CachedImage } from 'react-native-cached-image'
import { CheckRoundIcon } from '../../assets/icons'
import { isExists } from '../../utils'

const SoundcastItemWrapper = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  background-color: ${({ theme }) => theme.color.mainWhite};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.border};
  padding: 16px 14px 12px 23px;
  flex-direction: row;
  align-items: center;
`

const SoundcastImage = styled(CachedImage).attrs({
  imageStyle: ({ theme }) => ({
    borderWidth: 0.5,
    borderColor: theme.color.border,
  }),
})`
  width: 55px;
  height: 55px;
  background-color: ${({ theme }) => theme.color.mainOrange};
`

const ImageFiller = SoundcastImage.withComponent(View)

const SoundcastText = StyledText.extend.attrs({
  size: TEXT_SIZE.M,
})`
  margin-horizontal: 16px;
  flex: 1;
`

class SoundcastItem extends React.PureComponent {
  static propTypes = {
    imageUrl: PropTypes.string,
    title: PropTypes.string,
    isSelected: PropTypes.bool,
  }

  render() {
    const {
      imageUrl,
      title,
      isSelected,
      soundcastId,
      onPress,
      ...rest
    } = this.props
    return (
      <SoundcastItemWrapper onPress={this._handlePressItem} {...rest}>
        {isExists(imageUrl) ? (
          <SoundcastImage source={{ uri: imageUrl }} />
        ) : (
          <ImageFiller />
        )}
        <SoundcastText>{title}</SoundcastText>
        {isSelected && <CheckRoundIcon />}
      </SoundcastItemWrapper>
    )
  }

  _handlePressItem = () =>
    this.props.onPress(R.pick(['imageUrl', 'soundcastId', 'title'], this.props))
}

export default SoundcastItem
