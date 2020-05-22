import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StyledText, TEXT_SIZE, TEXT_COLOR } from '../components'
import { isExists } from '../utils'

const SoundcastWrapper = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })`
  flex-direction: row;
  border-bottom-width: 0.5px;
  border-color: ${({ theme }) => theme.color.border};
  padding: 22px 21px 15px;
`

const Image = styled.Image`
  width: 70px;
  height: 70px;
`

const ImageFiller = styled.View`
  width: 70px;
  height: 70px;
  background-color: ${({ theme }) => theme.color.mainOrange};
`

const TitleWrapper = styled.View`
  justify-content: space-between;
  padding-bottom: 6px;
  padding-top: 3px;
  margin-left: 18px;
  flex: 1;
`

const TitleText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXM,
  numberOfLines: 2,
})``

const SubTitleText = StyledText.extend.attrs({
  size: TEXT_SIZE.M,
  color: TEXT_COLOR.FONT_GREY,
})``

class SearchSoundcast extends React.PureComponent {
  static propTypes = {
    soundcastId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    subtitle: PropTypes.string,
    imageUrl: PropTypes.string,
  }

  static ITEM_HEIGHT = 107

  _handlePress = () => this.props.onPress(this.props.soundcastId)

  render() {
    const { title, subtitle, imageUrl } = this.props
    return (
      <SoundcastWrapper onPress={this._handlePress}>
        {isExists(imageUrl) ? (
          <Image source={{ uri: imageUrl }} />
        ) : (
          <ImageFiller />
        )}
        <TitleWrapper>
          <TitleText>{title}</TitleText>
          {isExists(subtitle) && <SubTitleText>{subtitle}</SubTitleText>}
        </TitleWrapper>
      </SoundcastWrapper>
    )
  }
}

export default SearchSoundcast
