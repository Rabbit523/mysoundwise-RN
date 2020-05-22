import React from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import styled from 'styled-components'
import { CachedImage } from 'react-native-cached-image'
import { StyledText, TEXT_COLOR, TEXT_SIZE } from '../components'
import { isExists } from '../utils'

const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  margin: 7px;
  box-shadow: 0px 2px 4px #c3c3c3;
  elevation: 4;
  background-color: ${({ theme }) => theme.color.mainWhite};
`

const SoundcastImage = styled(CachedImage)`
  width: 142px;
  height: 143px;
`

const ImageFiller = SoundcastImage.withComponent(View)

const Body = styled.View`
  padding: 17px 5px 15px;
  height: 100px;
  width: 142px;
  justify-content: space-between;
  align-items: center;
`

const TitleText = StyledText.extend.attrs({
  numberOfLines: 3,
})`
  text-align: center;
`

const PublisherText = StyledText.extend.attrs({
  size: TEXT_SIZE.XXS,
  color: TEXT_COLOR.FONT_BLACK,
  numberOfLines: 1,
})`
  text-align: center;
`

class ExploreSoundcast extends React.PureComponent {
  static propTypes = {
    imageUrl: PropTypes.string,
    publisherName: PropTypes.string,
    title: PropTypes.string.isRequired,
    onPressItem: PropTypes.func.isRequired,
    soundcastId: PropTypes.string.isRequired,
  }

  _handlePress = () => this.props.onPressItem(this.props.soundcastId)

  render() {
    const { imageUrl, title, publisherName } = this.props
    return (
      <Container onPress={this._handlePress}>
        {isExists(imageUrl) ? (
          <SoundcastImage source={{ uri: imageUrl }} />
        ) : (
          <ImageFiller />
        )}
        <Body>
          <TitleText>{title}</TitleText>
          {isExists(publisherName) && (
            <PublisherText>{publisherName}</PublisherText>
          )}
        </Body>
      </Container>
    )
  }
}

export default ExploreSoundcast
